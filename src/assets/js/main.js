        import { sendContactMessage } from '../../services/contact.service';

        // Variables globales
        let currentSection = 'inicio';
        let mouseX = 0;
        let mouseY = 0;
        
        // Textos para el efecto de typing
        const typingTexts = [
            'Ingeniero en Sistemas',
            'Analista de Sistemas',
            'Desarrollador Full Stack',
            'Desarrollador Web',
            'Desarrollador de Software',
        ];
        let currentTextIndex = 0;
        let currentCharIndex = 0;
        let isDeleting = false;
        
        // Inicialización cuando el DOM está listo
        function init() {
            initializeTheme();
            initializeNavigation();
            initializeAnimations();
            initializeTypingEffect();
            initializeSkillBars();
            initializeProjectFilters();
            initializeContactForm();
            initializeScrollEffects();
            initializeParticleInteraction();
            createParticles();
        }

        // Maneja tanto carga diferida como inline (Astro defer/module scripts)
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
        } else {
            init();
        }

        // Gestión del tema claro/oscuro
        function initializeTheme() {
            const themeToggle = document.getElementById('theme-toggle');
            if (!themeToggle) return;

            themeToggle.addEventListener('click', function() {
                document.documentElement.classList.toggle('dark');
                const isDark = document.documentElement.classList.contains('dark');
                localStorage.setItem('theme', isDark ? 'dark' : 'light');
            });
        }

        // Navegación
        function initializeNavigation() {
            const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
            const mobileMenu = document.getElementById('mobile-menu');

            if (mobileMenuToggle && mobileMenu) {
                mobileMenuToggle.addEventListener('click', function() {
                    mobileMenu.classList.toggle('hidden');
                });

                const mobileLinks = mobileMenu.querySelectorAll('a');
                mobileLinks.forEach(link => {
                    link.addEventListener('click', function() {
                        mobileMenu.classList.add('hidden');
                    });
                });
            }

            // Navegación suave con offset corregido
            const navLinks = document.querySelectorAll('a[href^="#"]');
            navLinks.forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    const targetId = this.getAttribute('href');
                    const targetSection = document.querySelector(targetId);
                    
                    if (targetSection) {
                        const headerHeight = 140; // Altura del header fijo aumentada
                        const offsetTop = targetSection.offsetTop - headerHeight;
                        window.scrollTo({
                            top: offsetTop,
                            behavior: 'smooth'
                        });
                    }
                });
            });

            // Actualizar navegación activa
            window.addEventListener('scroll', updateActiveNavigation);
        }

        // Actualizar navegación activa
        function updateActiveNavigation() {
            const sections = document.querySelectorAll('section[id]');
            const navLinks = document.querySelectorAll('.nav-link');
            const headerHeight = 140;
            
            let current = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop - headerHeight - 50;
                const sectionHeight = section.clientHeight;
                
                if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });
            
            navLinks.forEach(link => {
                link.classList.remove('nav-active');
                if (link.getAttribute('href') === '#' + current) {
                    link.classList.add('nav-active');
                }
            });
        }

        // Animaciones de entrada
        function initializeAnimations() {
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };
            
            const observer = new IntersectionObserver(function(entries) {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-slide-up');
                    }
                });
            }, observerOptions);
            
            // Observar elementos para animaciones
            const animatedElements = document.querySelectorAll('.hover-lift, .project-card, .timeline-item, .tech-card');
            animatedElements.forEach(el => observer.observe(el));
        }

        // Efecto de typing
        function initializeTypingEffect() {
            const typingElement = document.getElementById('typing-text');
            if (!typingElement) return;
            
            function typeText() {
                const currentText = typingTexts[currentTextIndex];
                
                if (!isDeleting) {
                    typingElement.textContent = currentText.substring(0, currentCharIndex + 1);
                    currentCharIndex++;
                    
                    if (currentCharIndex === currentText.length) {
                        isDeleting = true;
                        setTimeout(typeText, 2000); // Pausa antes de borrar
                        return;
                    }
                } else {
                    typingElement.textContent = currentText.substring(0, currentCharIndex - 1);
                    currentCharIndex--;
                    
                    if (currentCharIndex === 0) {
                        isDeleting = false;
                        currentTextIndex = (currentTextIndex + 1) % typingTexts.length;
                    }
                }
                
                const typingSpeed = isDeleting ? 50 : 100;
                setTimeout(typeText, typingSpeed);
            }
            
            typeText();
        }

        // Animación de barras de habilidades
        function initializeSkillBars() {
            const skillBars = document.querySelectorAll('.skill-progress');
            
            const skillObserver = new IntersectionObserver(function(entries) {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const progressBar = entry.target;
                        const width = progressBar.getAttribute('data-width');
                        
                        setTimeout(() => {
                            progressBar.style.width = width + '%';
                        }, 500);
                        
                        skillObserver.unobserve(progressBar);
                    }
                });
            }, { threshold: 0.5 });
            
            skillBars.forEach(bar => skillObserver.observe(bar));
        }

        // Filtros de proyectos
        function initializeProjectFilters() {
            const filterButtons = document.querySelectorAll('.filter-btn');
            const projectItems = document.querySelectorAll('.project-item');
            
            filterButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const filter = this.getAttribute('data-filter');
                    
                    // Actualizar botones activos
                    filterButtons.forEach(btn => {
                        btn.classList.remove('active', 'bg-primary-500', 'text-white');
                        btn.classList.add('bg-gray-200', 'dark:bg-gray-700', 'text-gray-700', 'dark:text-gray-300');
                    });
                    
                    this.classList.add('active', 'bg-primary-500', 'text-white');
                    this.classList.remove('bg-gray-200', 'dark:bg-gray-700', 'text-gray-700', 'dark:text-gray-300');
                    
                    // Filtrar proyectos
                    projectItems.forEach(item => {
                        const category = item.getAttribute('data-category');
                        
                        if (filter === 'all' || category === filter) {
                            item.style.display = 'block';
                            item.classList.add('animate-scale-in');
                        } else {
                            item.style.display = 'none';
                        }
                    });
                });
            });
        }

        // Formulario de contacto
        function initializeContactForm() {
            const form = document.getElementById('contact-form');
            if (!form) return;

            const submitBtn = document.getElementById('cf-submit');
            const feedback = document.getElementById('cf-feedback');

            form.addEventListener('submit', async function(e) {
                e.preventDefault();

                const payload = {
                    name: form.querySelector('[name="name"]').value,
                    email: form.querySelector('[name="email"]').value,
                    subject: form.querySelector('[name="subject"]').value,
                    message: form.querySelector('[name="message"]').value,
                };

                setSubmitting(true);
                hideFeedback();

                try {
                    const data = await sendContactMessage(payload);

                    if (data.success) {
                        showFeedback('success', '<i class="fas fa-check-circle mr-2"></i>¡Mensaje enviado! Te respondo a la brevedad.');
                        form.reset();
                    } else {
                        showFeedback('error', '<i class="fas fa-exclamation-circle mr-2"></i>' + (data.message || 'Error al enviar. Intentá nuevamente.'));
                    }
                } catch {
                    showFeedback('error', '<i class="fas fa-exclamation-circle mr-2"></i>Error de conexión. Intentá nuevamente.');
                } finally {
                    setSubmitting(false);
                }
            });

            function setSubmitting(loading) {
                submitBtn.disabled = loading;
                submitBtn.innerHTML = loading
                    ? '<i class="fas fa-spinner fa-spin mr-2"></i>Enviando...'
                    : '<i class="fas fa-paper-plane mr-2"></i>Enviar mensaje';
            }

            function showFeedback(type, html) {
                feedback.innerHTML = html;
                feedback.className = type === 'success'
                    ? 'text-sm font-medium px-4 py-2.5 rounded-xl bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                    : 'text-sm font-medium px-4 py-2.5 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
            }

            function hideFeedback() {
                feedback.className = 'hidden';
                feedback.innerHTML = '';
            }
        }

        // Efectos de scroll
        function initializeScrollEffects() {
            let ticking = false;
            
            function updateScrollEffects() {
                const scrolled = window.pageYOffset;
                const parallax = document.querySelector('.gradient-bg');
                
                if (parallax) {
                    const speed = scrolled * 0.5;
                    parallax.style.transform = `translateY(${speed}px)`;
                }
                
                ticking = false;
            }
            
            function requestTick() {
                if (!ticking) {
                    requestAnimationFrame(updateScrollEffects);
                    ticking = true;
                }
            }
            
            window.addEventListener('scroll', requestTick);
        }

        // Interacción de partículas con el mouse
        function initializeParticleInteraction() {
            const heroSection = document.getElementById('inicio');
            if (!heroSection) return;

            heroSection.addEventListener('mousemove', function(e) {
                mouseX = e.clientX;
                mouseY = e.clientY;
                
                const particles = document.querySelectorAll('.particle');
                particles.forEach(particle => {
                    const rect = particle.getBoundingClientRect();
                    const particleX = rect.left + rect.width / 2;
                    const particleY = rect.top + rect.height / 2;
                    
                    const distance = Math.sqrt(
                        Math.pow(mouseX - particleX, 2) + Math.pow(mouseY - particleY, 2)
                    );
                    
                    if (distance < 100) {
                        const angle = Math.atan2(particleY - mouseY, particleX - mouseX);
                        const force = (100 - distance) / 100;
                        const moveX = Math.cos(angle) * force * 30;
                        const moveY = Math.sin(angle) * force * 30;
                        
                        particle.style.transform = `translate(${moveX}px, ${moveY}px)`;
                        particle.style.opacity = 0.8 + (force * 0.2);
                    } else {
                        particle.style.transform = 'translate(0px, 0px)';
                        particle.style.opacity = 0.6;
                    }
                });
            });
            
            heroSection.addEventListener('mouseleave', function() {
                const particles = document.querySelectorAll('.particle');
                particles.forEach(particle => {
                    particle.style.transform = 'translate(0px, 0px)';
                    particle.style.opacity = 0.6;
                });
            });
        }

        // Crear partículas animadas
        function createParticles() {
            const particlesContainer = document.getElementById('particles-container');
            if (!particlesContainer) return;
            const particleCount = 30;
            
            for (let i = 0; i < particleCount; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                
                // Posición aleatoria
                particle.style.left = Math.random() * 100 + '%';
                particle.style.top = Math.random() * 100 + '%';
                
                // Tamaño aleatorio
                const size = Math.random() * 4 + 1;
                particle.style.width = size + 'px';
                particle.style.height = size + 'px';
                
                // Duración de animación aleatoria
                particle.style.animationDuration = (Math.random() * 3 + 2) + 's';
                particle.style.animationDelay = Math.random() * 2 + 's';
                
                particlesContainer.appendChild(particle);
            }
        }

        // Efectos de mouse
        document.addEventListener('mousemove', function(e) {
            // Efecto parallax sutil en las tarjetas
            const cards = document.querySelectorAll('.hover-lift, .tech-card');
            cards.forEach(card => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;
                    const rotateX = (y - centerY) / 20;
                    const rotateY = (centerX - x) / 20;
                    
                    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
                } else {
                    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
                }
            });
        });

        // Optimización de rendimiento
        function debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        }

        // Lazy loading para imágenes
        function initializeLazyLoading() {
            const images = document.querySelectorAll('img[data-src]');
            
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            images.forEach(img => imageObserver.observe(img));
        }

        // Inicializar lazy loading
        initializeLazyLoading();