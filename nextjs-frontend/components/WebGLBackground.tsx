'use client';

import { useEffect, useRef } from 'react';

export default function WebGLBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Initialize WebGL context
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl') as WebGLRenderingContext;
    if (!gl) {
      console.error('WebGL not supported');
      return;
    }

    // EXACT Vertex shader from original
    const vertexShaderSource = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
    `;

    // EXACT Fragment shader from original - CHARACTER FOR CHARACTER
    const fragmentShaderSource = `
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

vec3 palette2(float t, float factor) {
    // Brand colors: Amber/Yellow/Orange (#fdcd4c) and Neon Green (#00ff88)
    // Amber RGB: (0.99, 0.80, 0.30), Green RGB: (0.0, 1.0, 0.53)
    vec3 a = vec3(0.99, 0.80, 0.30) + 0.2 * sin(vec3(0.1, 0.3, 0.5) * factor);
    vec3 b = vec3(0.0, 1.0, 0.53) * 0.4 + 0.2 * cos(vec3(0.2, 0.4, 0.6) * factor);
    vec3 c = vec3(1.0, 0.9, 0.5) + 0.3 * sin(vec3(0.3, 0.7, 0.9) * factor);
    vec3 d = vec3(0.8, 0.7, 0.3) + 0.15 * cos(vec3(0.5, 0.6, 0.7) * factor);
    return a + b * cos(6.28318 * (c * t + d));
}

float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
               u.y);
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st.x *= u_resolution.x/u_resolution.y;
    vec3 color = vec3(0.0);
    vec2 uv = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / u_resolution.y;
    uv.x = abs(uv.x);
    uv *= 20.0;

    for (int i = 0; i < 30; i++) {
        float t = u_time * 0.01 - float(i);
        uv *= mat2(cos(t), sin(t), -sin(t), cos(t));
        uv += noise(sin(uv) * 0.6);
        uv += noise(-cos(uv) * 0.6);

        color += 0.002 / length(uv + sin(t));

        float intensity = 0.1 / length(uv - (10.3) * sin(t)) * (length(uv) * sin(float(i) + u_time));

        color += palette2(float(i) / u_time, u_time * 0.5) * intensity;
    }

    gl_FragColor = vec4(color, 1.0);
}
    `;

    // Create and compile shaders
    const createShader = (type: number, source: string): WebGLShader | null => {
      const shader = gl.createShader(type);
      if (!shader) return null;

      gl.shaderSource(shader, source);
      gl.compileShader(shader);

      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compile error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertexShader = createShader(gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl.FRAGMENT_SHADER, fragmentShaderSource);

    if (!vertexShader || !fragmentShader) {
      console.error('Failed to create shaders');
      return;
    }

    // Create and link program
    const program = gl.createProgram();
    if (!program) {
      console.error('Failed to create program');
      return;
    }

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    // Get uniform locations
    const u_time = gl.getUniformLocation(program, 'u_time');
    const u_resolution = gl.getUniformLocation(program, 'u_resolution');
    const u_mouse = gl.getUniformLocation(program, 'u_mouse');

    // EXACT position buffer from original: [-1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0]
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = new Float32Array([
      -1.0, -1.0,
       1.0, -1.0,
      -1.0,  1.0,
       1.0,  1.0
    ]);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    // Mouse tracking
    const handleMouseMove = (event: MouseEvent) => {
      mouseRef.current.x = event.clientX;
      mouseRef.current.y = event.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Resize handler - EXACT from original
    const resizeCanvas = () => {
      if (!canvas) return;

      const devicePixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      const width = window.innerWidth;
      const height = window.innerHeight;

      canvas.width = width * devicePixelRatio;
      canvas.height = height * devicePixelRatio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(u_resolution, canvas.width, canvas.height);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Animation loop - EXACT startOffset = 20.0
    const startOffset = 20.0;
    const startTime = Date.now();

    const animate = () => {
      if (!gl || !canvas) return;

      const time = Date.now() - startTime;
      const currentTime = time * 0.001 + startOffset;

      gl.uniform1f(u_time, currentTime);
      gl.uniform2f(u_mouse, mouseRef.current.x, mouseRef.current.y);

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      // EXACT draw call: TRIANGLE_STRIP with 4 vertices
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);

      if (vertexShader) gl.deleteShader(vertexShader);
      if (fragmentShader) gl.deleteShader(fragmentShader);
      if (positionBuffer) gl.deleteBuffer(positionBuffer);
      if (program) gl.deleteProgram(program);

      const loseContextExt = gl.getExtension('WEBGL_lose_context');
      if (loseContextExt) {
        loseContextExt.loseContext();
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
}
