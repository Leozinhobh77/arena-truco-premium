/* ============================================================
   ARENA TRUCO: ENCICLOPÉDIA TÉCNICA — script.js
   Dynamic Interaction Engine v4.0
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. NEURAL BACKGROUND CANVAS
    const canvas = document.getElementById('neural-bg');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        
        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        
        class Particle {
            constructor() {
                this.reset();
            }
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.size = Math.random() * 2;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
            }
        }
        
        for (let i = 0; i < 100; i++) particles.push(new Particle());
        
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#d4a017';
            ctx.strokeStyle = 'rgba(212, 160, 23, 0.1)';
            
            particles.forEach((p, i) => {
                p.update();
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
                
                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dx = p.x - p2.x;
                    const dy = p.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 150) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }
            });
            requestAnimationFrame(animate);
        };
        
        window.addEventListener('resize', resize);
        resize();
        animate();
    }

    // 2. INTERSECTION OBSERVER FOR SECTIONS
    const observerOptions = { threshold: 0.2 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Update Sidebar
                const id = entry.target.getAttribute('id');
                document.querySelectorAll('.nav-links a').forEach(a => {
                    a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
                });
            }
        });
    }, observerOptions);

    document.querySelectorAll('section').forEach(section => observer.observe(section));

    // 3. FILE EXPLORER DATA
    const projectStructure = [
        { name: 'src/', type: 'folder', desc: 'Diretório raiz do código fonte.', children: ['main.tsx', 'App.tsx', 'index.css'] },
        { name: 'src/screens/', type: 'folder', desc: 'Controladores das 5 telas principais do SPA (Arena, Loja, etc).', children: ['ArenaScreen.tsx', 'LoginScreen.tsx', 'ClansScreen.tsx'] },
        { name: 'src/overlays/', type: 'folder', desc: 'Componentes de tela cheia ou suspensos (Mesa de Jogo, Lobby).', children: ['GameOverlay.tsx', 'SalasOverlay.tsx'] },
        { name: 'src/stores/', type: 'folder', desc: 'Gerenciamento de estado global via Zustand (Auth, Jogo, Nav).', children: ['useGameStore.ts', 'useAuthStore.ts'] },
        { name: 'src/lib/truco/', type: 'folder', desc: 'Motor de regras puro. Lógica de manilhas, força e cartas.', children: ['rules.ts'] },
        { name: 'src/components/', type: 'folder', desc: 'Átomos visuais reutilizáveis.', children: ['PlayingCard.tsx', 'PlayerAvatar.tsx'] },
        { name: 'docs/', type: 'folder', desc: 'Acervo documental técnico (PRD, SDD, Manuail).', children: ['PRD.md', 'SDD.md', 'manual-tecnico/'] }
    ];

    const explorerRoot = document.getElementById('file-explorer-root');
    const detailTitle = document.getElementById('detail-title');
    const detailDesc = document.getElementById('detail-desc');
    const detailFiles = document.getElementById('detail-files');

    projectStructure.forEach(item => {
        const div = document.createElement('div');
        div.className = `explorer-item ${item.type}`;
        div.innerHTML = `<i class="fa-solid ${item.type === 'folder' ? 'fa-folder' : 'fa-file-code'}"></i> ${item.name}`;
        
        div.onclick = () => {
            document.querySelectorAll('.explorer-item').forEach(el => el.classList.remove('active'));
            div.classList.add('active');
            
            detailTitle.innerText = item.name;
            detailDesc.innerText = item.desc;
            detailFiles.innerHTML = item.children.map(f => `<span class="file-tag">${f}</span>`).join('');
        };
        
        explorerRoot.appendChild(div);
    });

    // 4. TIMELINE DATA (SPRINTS)
    const sprints = [
        {
            num: 1,
            date: '12 Abril 2026',
            title: 'Bootcamp UI/UX e Estrutura SPA',
            desc: 'Fundação do app. Criação do design system Obsidian & Gold, navegação Swipe 5-tabs e as 6 telas core.'
        },
        {
            num: 2,
            date: '12 Abril 2026',
            title: 'Core Engine & Mesa de Jogo',
            desc: 'Implementação do motor de regras de Truco paulista/mineiro. Criação da mesa de jogo e IA básica de pods.'
        },
        {
            num: 3,
            date: 'Em Progresso',
            title: 'Refinamento & Deploy Híbrido',
            desc: 'Ajustes de responsividade para Desktop (Sidebar) e correções de Safe Area para dispositivos mobile com notch.'
        }
    ];

    const timeline = document.getElementById('sprint-timeline');
    sprints.forEach(s => {
        const item = document.createElement('div');
        item.className = 'timeline-item';
        item.innerHTML = `
            <span class="timeline-date">Sprint ${s.num} • ${s.date}</span>
            <h3 class="timeline-title">${s.title}</h3>
            <p class="desc-text">${s.desc}</p>
        `;
        timeline.appendChild(item);
    });

    // 5. INITIALIZE VANILLA TILT (se disponível)
    if (typeof VanillaTilt !== 'undefined') {
        VanillaTilt.init(document.querySelectorAll("[data-tilt]"), {
            max: 5,
            speed: 400,
            glare: true,
            "max-glare": 0.2
        });
    }

});
