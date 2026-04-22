// ============================================================
// COMPONENT: ARENA 3D — Arena3D.tsx
// Renderização 3D realista da Arena Truco com Three.js
// ============================================================

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function Arena3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // ── SCENE SETUP ──────────────────────────────────────
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a14);
    scene.fog = new THREE.Fog(0x0a0a14, 300, 600);
    sceneRef.current = scene;

    // ── CAMERA ──────────────────────────────────────────
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    const camera = new THREE.PerspectiveCamera(
      55,
      width / height,
      0.1,
      1000
    );
    camera.position.set(0, 80, 120);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // ── RENDERER ────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // ── LIGHTING ────────────────────────────────────────
    // Luz ambiente suave
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    // Luz direcional (dramática, tipo sun)
    const dirLight = new THREE.DirectionalLight(0xffd700, 1.2);
    dirLight.position.set(100, 150, 80);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.left = -300;
    dirLight.shadow.camera.right = 300;
    dirLight.shadow.camera.top = 300;
    dirLight.shadow.camera.bottom = -300;
    dirLight.shadow.camera.far = 500;
    scene.add(dirLight);

    // Lights pontuais (entrada, laterais)
    const pointLight1 = new THREE.PointLight(0xffffff, 1, 200);
    pointLight1.position.set(-80, 60, 0);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xffffff, 1, 200);
    pointLight2.position.set(80, 60, 0);
    scene.add(pointLight2);

    const pointLight3 = new THREE.PointLight(0xff6b35, 0.8, 150);
    pointLight3.position.set(0, 120, -100);
    scene.add(pointLight3);

    // ── GROUND ──────────────────────────────────────────
    const groundGeometry = new THREE.CircleGeometry(250, 64);
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: 0x1a1a2e,
      roughness: 0.8,
      metalness: 0.1,
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.5;
    ground.receiveShadow = true;
    scene.add(ground);

    // ── ESTÁDIO PRINCIPAL (ESTRUTURA OVAL) ──────────────
    // Torus (anel) que forma a base/estrutura principal
    const stadiumGeometry = new THREE.TorusGeometry(80, 15, 32, 128);
    const stadiumMaterial = new THREE.MeshStandardMaterial({
      color: 0x2a2a3e,
      roughness: 0.6,
      metalness: 0.3,
    });
    const stadium = new THREE.Mesh(stadiumGeometry, stadiumMaterial);
    stadium.castShadow = true;
    stadium.receiveShadow = true;
    stadium.scale.set(1.3, 0.8, 1);
    stadium.rotation.x = Math.PI / 2.2;
    stadium.position.y = 20;
    scene.add(stadium);

    // ── COLUNAS ESTRUTURAIS ─────────────────────────────
    const columnPositions = [];
    const columnCount = 12;
    for (let i = 0; i < columnCount; i++) {
      const angle = (i / columnCount) * Math.PI * 2;
      const radius = 85;
      columnPositions.push({
        x: Math.cos(angle) * radius,
        z: Math.sin(angle) * radius,
      });
    }

    columnPositions.forEach((pos, _idx) => {
      // Coluna cilíndrica
      const columnGeometry = new THREE.CylinderGeometry(4, 5, 70, 16);
      const columnMaterial = new THREE.MeshStandardMaterial({
        color: 0xd4a017,
        roughness: 0.4,
        metalness: 0.5,
      });
      const column = new THREE.Mesh(columnGeometry, columnMaterial);
      column.position.set(pos.x, 35, pos.z);
      column.castShadow = true;
      column.receiveShadow = true;
      scene.add(column);

      // Light highlight nas colunas (white/gold)
      const highlightGeometry = new THREE.CylinderGeometry(1.5, 2, 70, 8);
      const highlightMaterial = new THREE.MeshStandardMaterial({
        color: 0xffd700,
        roughness: 0.3,
        metalness: 0.7,
      });
      const highlight = new THREE.Mesh(highlightGeometry, highlightMaterial);
      highlight.position.set(pos.x + 3, 35, pos.z + 2);
      highlight.castShadow = true;
      scene.add(highlight);
    });

    // ── DOME/TELHADO (cúpula superior) ──────────────────
    const domeGeometry = new THREE.IcosahedronGeometry(85, 4);
    const domeMaterial = new THREE.MeshStandardMaterial({
      color: 0x1a1a2e,
      roughness: 0.7,
      metalness: 0.2,
      side: THREE.BackSide, // Inside view
    });
    const dome = new THREE.Mesh(domeGeometry, domeMaterial);
    dome.scale.set(1.3, 0.6, 1);
    dome.position.y = 60;
    dome.castShadow = true;
    scene.add(dome);

    // ── ENTRADA/LOGO (Box central) ──────────────────────
    const entranceGeometry = new THREE.BoxGeometry(20, 30, 8);
    const entranceMaterial = new THREE.MeshStandardMaterial({
      color: 0x1a1a1a,
      roughness: 0.5,
      metalness: 0.3,
    });
    const entrance = new THREE.Mesh(entranceGeometry, entranceMaterial);
    entrance.position.set(0, 15, 95);
    entrance.castShadow = true;
    entrance.receiveShadow = true;
    scene.add(entrance);

    // ── LOGO "ARENA TRUCO" (Canvas Texture) ─────────────
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;

    // Background do logo
    ctx.fillStyle = '#0a0a14';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Texto principal
    ctx.fillStyle = '#d4a017';
    ctx.font = 'bold 80px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('ARENA', canvas.width / 2, canvas.height / 2 - 40);

    // Subtítulo
    ctx.fillStyle = '#ffd700';
    ctx.font = 'bold 50px Arial, sans-serif';
    ctx.fillText('TRUCO', canvas.width / 2, canvas.height / 2 + 40);

    // Borda decorativa
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 3;
    ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

    const logoTexture = new THREE.CanvasTexture(canvas);
    logoTexture.magFilter = THREE.LinearFilter;
    logoTexture.minFilter = THREE.LinearFilter;

    const logoGeometry = new THREE.PlaneGeometry(18, 9);
    const logoMaterial = new THREE.MeshStandardMaterial({
      map: logoTexture,
      emissive: 0xd4a017,
      emissiveIntensity: 0.5,
    });
    const logo = new THREE.Mesh(logoGeometry, logoMaterial);
    logo.position.set(0, 15, 99.5);
    scene.add(logo);

    // ── LIGHT BEAMS (Cones de luz radiando) ──────────────
    const beamCount = 5;
    for (let i = 0; i < beamCount; i++) {
      const angle = (i / beamCount) * Math.PI * 2;
      const beamGeometry = new THREE.ConeGeometry(15, 150, 8);
      const beamMaterial = new THREE.MeshStandardMaterial({
        color: 0xffd700,
        emissive: 0xffd700,
        emissiveIntensity: 0.4,
        roughness: 0.8,
        transparent: true,
        opacity: 0.1,
      });
      const beam = new THREE.Mesh(beamGeometry, beamMaterial);
      beam.position.set(
        Math.cos(angle) * 60,
        120,
        Math.sin(angle) * 60
      );
      beam.rotation.z = angle;
      scene.add(beam);
    }

    // ── PARTICLES (Pontos flutuantes) ────────────────────
    const particleCount = 50;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 300;
      particlePositions[i + 1] = Math.random() * 200;
      particlePositions[i + 2] = (Math.random() - 0.5) * 300;
    }

    particleGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(particlePositions, 3)
    );

    const particleMaterial = new THREE.PointsMaterial({
      color: 0xffd700,
      size: 0.5,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.6,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // ── ANIMATION LOOP ──────────────────────────────────
    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      // Rotação lenta do estádio
      stadium.rotation.z += 0.0003;

      // Flutuação das partículas
      if (particles.geometry.attributes.position) {
        const positions = particles.geometry.attributes.position.array as Float32Array;
        for (let i = 1; i < positions.length; i += 3) {
          positions[i] += Math.sin(Date.now() * 0.0001 + i) * 0.02;
        }
        particles.geometry.attributes.position.needsUpdate = true;
      }

      // Pulsação da luz do logo
      logoMaterial.emissiveIntensity = 0.4 + Math.sin(Date.now() * 0.003) * 0.2;

      renderer.render(scene, camera);
    };

    animate();

    // ── HANDLE RESIZE ────────────────────────────────────
    const handleResize = () => {
      if (!containerRef.current || !camera || !renderer) return;

      const newWidth = containerRef.current.clientWidth;
      const newHeight = containerRef.current.clientHeight;

      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // ── CLEANUP ──────────────────────────────────────────
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      renderer.dispose();
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        minHeight: 400,
        background: 'linear-gradient(135deg, #0a0a14 0%, #1a1a2e 100%)',
        borderRadius: 12,
        overflow: 'hidden',
      }}
    />
  );
}
