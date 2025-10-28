"use client"

import * as React from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Card, CardContent, CardHeader } from "@saa/shared/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@saa/shared/components/ui/avatar"
import { Mail, Phone } from "lucide-react"
import type { TeamLeader } from "@/types/homepage"
import { cn } from "@/lib/utils"

interface TeamLeadersProps {
  leaders?: TeamLeader[]
  className?: string
}

const DEFAULT_LEADERS: TeamLeader[] = [
  {
    name: "Team Leader 1",
    title: "Team Lead",
    bio: "Experienced real estate professional dedicated to helping agents succeed.",
    image: "/images/team/leader-1.jpg",
    email: "leader1@smartagentalliance.com",
    phone: "(555) 123-4567"
  },
  {
    name: "Team Leader 2",
    title: "Senior Advisor",
    bio: "Passionate about building strong teams and fostering growth.",
    image: "/images/team/leader-2.jpg",
    email: "leader2@smartagentalliance.com",
    phone: "(555) 987-6543"
  }
]

interface LeaderCardProps {
  leader: TeamLeader
  index: number
}

function LeaderCard({ leader, index }: LeaderCardProps) {
  const [isExpanded, setIsExpanded] = React.useState(false)
  const cardRef = React.useRef<HTMLDivElement>(null)

  // Parallax effect on scroll
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"]
  })

  const imageY = useTransform(scrollYProgress, [0, 1], [0, -50])

  // Truncate bio to 150 characters
  const truncatedBio = leader.bio.length > 150
    ? `${leader.bio.substring(0, 150)}...`
    : leader.bio

  // Generate initials for avatar fallback
  const initials = leader.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2)

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{
        duration: 0.6,
        delay: index * 0.2,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
    >
      <Card
        className={cn(
          "group relative overflow-hidden bg-white transition-all duration-300",
          "hover:shadow-2xl hover:-translate-y-2",
          "border-0 shadow-lg"
        )}
      >
        <CardHeader className="relative pb-4">
          {/* Parallax Image Container */}
          <motion.div
            style={{ y: imageY }}
            className="flex justify-center mb-6"
          >
            <div className="relative">
              {/* Gold border ring */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 p-1 shadow-xl">
                <div className="w-full h-full rounded-full bg-white" />
              </div>

              {/* Avatar */}
              <Avatar className={cn(
                "h-32 w-32 border-4 border-white relative z-10",
                "transition-transform duration-500 group-hover:scale-110",
                "shadow-2xl"
              )}>
                <AvatarImage
                  src={leader.image}
                  alt={leader.name}
                  className="object-cover"
                />
                <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-amber-100 to-yellow-100 text-amber-900">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </div>
          </motion.div>

          {/* Name and Title */}
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-bold tracking-tight text-gray-900">
              {leader.name}
            </h3>
            <p className="text-base text-amber-600 font-medium">
              {leader.title}
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Bio */}
          <div className="text-center">
            <p className="text-sm text-gray-600 leading-relaxed">
              {isExpanded ? leader.bio : truncatedBio}
            </p>

            {leader.bio.length > 150 && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className={cn(
                  "mt-3 text-sm font-semibold text-amber-600",
                  "hover:text-amber-700 transition-colors",
                  "focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 rounded-md px-2 py-1"
                )}
              >
                {isExpanded ? 'Read Less' : 'Read More'}
              </button>
            )}
          </div>

          {/* Contact Information */}
          {(leader.email || leader.phone) && (
            <div className="flex flex-col gap-2 pt-4 border-t border-gray-100">
              {leader.email && (
                <a
                  href={`mailto:${leader.email}`}
                  className={cn(
                    "flex items-center gap-2 text-sm text-gray-600",
                    "hover:text-amber-600 transition-colors group/link"
                  )}
                >
                  <Mail className="h-4 w-4 text-amber-500 group-hover/link:text-amber-600 transition-colors" />
                  <span className="truncate">{leader.email}</span>
                </a>
              )}

              {leader.phone && (
                <a
                  href={`tel:${leader.phone}`}
                  className={cn(
                    "flex items-center gap-2 text-sm text-gray-600",
                    "hover:text-amber-600 transition-colors group/link"
                  )}
                >
                  <Phone className="h-4 w-4 text-amber-500 group-hover/link:text-amber-600 transition-colors" />
                  <span>{leader.phone}</span>
                </a>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

export function TeamLeaders({ leaders = DEFAULT_LEADERS, className }: TeamLeadersProps) {
  return (
    <section className={cn("w-full py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white", className)}>
      <div className="container px-4 md:px-6 mx-auto">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 mb-4">
            Meet Our Team Leaders
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-yellow-600 mx-auto rounded-full" />
        </motion.div>

        {/* Leader Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 max-w-6xl mx-auto">
          {leaders.map((leader, index) => (
            <LeaderCard key={leader.name} leader={leader} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default TeamLeaders
