import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Force dynamic rendering - disable Next.js route cache
export const dynamic = 'error';

// GET - Fetch top 5 high scores (enforced limit)
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('dino_high_scores')
      .select('*')
      .order('score', { ascending: false })
      .limit(5);

    if (error) throw error;

    return NextResponse.json(
      { scores: data || [] },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
          'CDN-Cache-Control': 'no-store',
          'Cloudflare-CDN-Cache-Control': 'no-store'
        }
      }
    );
  } catch (error: any) {
    console.error('[Dino High Scores GET Error]:', error);
    return NextResponse.json(
      { error: 'Failed to fetch high scores', message: error.message },
      { status: 500 }
    );
  }
}

// POST - Submit a new high score (TOP 5 ONLY)
export async function POST(request: NextRequest) {
  try {
    const { player_name = 'Anonymous', score } = await request.json();

    if (typeof score !== 'number' || score < 0) {
      return NextResponse.json(
        { error: 'Invalid score' },
        { status: 400 }
      );
    }

    console.log('[SCORE SUBMISSION] Received score:', score, 'player:', player_name);

    // Get current top 5 scores
    const { data: topScores, error: topError } = await supabase
      .from('dino_high_scores')
      .select('*')
      .order('score', { ascending: false })
      .limit(5);

    if (topError) throw topError;

    console.log('[TOP 5 CHECK] Current top 5:', topScores?.map(s => s.score));

    // Check if score qualifies for top 5
    const qualifiesForTop5 = topScores.length < 5 || score > topScores[4]?.score;

    if (!qualifiesForTop5) {
      console.log('[REJECTED] Score does not qualify for top 5');
      return NextResponse.json({
        success: false,
        message: 'Score does not qualify for top 5',
        rank: null
      });
    }

    console.log('[QUALIFIED] Score qualifies for top 5, inserting...');

    // Insert new score
    const { data: insertedScore, error: insertError } = await supabase
      .from('dino_high_scores')
      .insert([{ player_name, score }])
      .select()
      .single();

    if (insertError) throw insertError;

    console.log('[INSERTED] New score inserted with ID:', insertedScore.id);

    // Get updated top 5
    const { data: updatedTop5, error: updatedError } = await supabase
      .from('dino_high_scores')
      .select('*')
      .order('score', { ascending: false })
      .limit(5);

    if (updatedError) throw updatedError;

    // Calculate rank (1-5)
    const rank = updatedTop5?.findIndex(s => s.id === insertedScore.id) + 1 || 0;

    console.log('[RANK] New score ranked at position:', rank);

    // DELETE ALL SCORES BEYOND TOP 5
    const top5Ids = updatedTop5?.map(s => s.id) || [];

    if (top5Ids.length > 0) {
      const { data: deletedScores, error: deleteError } = await supabase
        .from('dino_high_scores')
        .delete()
        .not('id', 'in', `(${top5Ids.join(',')})`)
        .select();

      if (deleteError) {
        console.error('[DELETE ERROR]:', deleteError);
      } else {
        console.log('[CLEANUP] Deleted', deletedScores?.length || 0, 'scores beyond top 5');
      }
    }

    console.log('[SAVE SUCCESS] Score saved successfully at rank', rank);

    return NextResponse.json({
      success: true,
      isHighScore: true,
      rank,
      score: insertedScore,
      topScores: updatedTop5
    });
  } catch (error: any) {
    console.error('[Dino High Scores POST Error]:', error);
    return NextResponse.json(
      { error: 'Failed to submit score', message: error.message },
      { status: 500 }
    );
  }
}
