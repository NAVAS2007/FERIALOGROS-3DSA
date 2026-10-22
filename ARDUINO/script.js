                                        // SECTION INICIAL: Navbar, Imagen presentacion, Botones

document.addEventListener('DOMContentLoaded', () => {
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const allNavLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

    if (!hamburgerBtn || !mobileMenu) {
        return;
    }

    const setMenuOpen = (isOpen) => {
        mobileMenu.classList.toggle('visible-menu', isOpen);
        mobileMenu.classList.toggle('hidden-menu', !isOpen);
        mobileMenu.setAttribute('aria-hidden', String(!isOpen));
        hamburgerBtn.setAttribute('aria-expanded', String(isOpen));
        hamburgerBtn.setAttribute(
            'aria-label',
            isOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'
        );
    };

    hamburgerBtn.addEventListener('click', () => {
        setMenuOpen(hamburgerBtn.getAttribute('aria-expanded') !== 'true');
    });

    allNavLinks.forEach((link) => {
        link.addEventListener('click', () => {
            allNavLinks.forEach((navLink) => {
                const isCurrentLink = navLink.getAttribute('href') === link.getAttribute('href');
                navLink.classList.toggle('text-sky-400', isCurrentLink);
                navLink.classList.toggle('font-semibold', isCurrentLink);
                navLink.classList.toggle('text-gray-300', !isCurrentLink);
            });
            setMenuOpen(false);
        });
    });

    document.addEventListener('click', (event) => {
        if (!mobileMenu.contains(event.target) && !hamburgerBtn.contains(event.target)) {
            setMenuOpen(false);
        }
    });

    (() => {
        const guide = document.querySelector('#arduino-construction-guide');
        const steps = guide ? Array.from(guide.querySelectorAll('[data-build-step]')) : [];
        const detail = guide ? guide.querySelector('#arduino-construction-detail') : null;
        const detailIcon = guide ? guide.querySelector('#arduino-construction-detail-icon') : null;
        const stepStatus = guide ? guide.querySelector('#arduino-construction-step-status') : null;
        const detailTitle = guide ? guide.querySelector('#arduino-construction-detail-title') : null;
        const detailDescription = guide ? guide.querySelector('#arduino-construction-detail-description') : null;
        const detailExample = guide ? guide.querySelector('#arduino-construction-detail-example') : null;
        const progress = guide ? guide.querySelector('#arduino-construction-progress') : null;
        const progressBar = guide ? guide.querySelector('#arduino-construction-progress-bar') : null;
        const exploredLabel = guide ? guide.querySelector('#arduino-construction-explored-label') : null;

        if (
            !guide || steps.length !== 4 || !detail || !detailIcon || !stepStatus ||
            !detailTitle || !detailDescription || !detailExample || !progress ||
            !progressBar || !exploredLabel
        ) {
            return;
        }

        const descriptions = {
            idea: {
                title: '1. Define tu idea',
                description: 'Decide qué quieres que haga el proyecto y qué deberá detectar o controlar. Una meta clara ayuda a elegir el circuito y a comprobar si funciona.',
                example: 'Quiero crear un semáforo que cambie entre las luces roja, amarilla y verde.',
                icon: '💡'
            },
            components: {
                title: '2. Elige los componentes',
                description: 'Haz una lista de la placa, los sensores o actuadores y los elementos de conexión que necesitas. Comprueba que sus voltajes y funciones sean compatibles.',
                example: 'Para el semáforo: una placa Arduino, tres LED, tres resistencias y una protoboard.',
                icon: '🔧'
            },
            connection: {
                title: '3. Conecta el circuito',
                description: 'Conecta cada componente a los pines adecuados siguiendo un esquema. Revisa la polaridad y las conexiones antes de alimentar la placa.',
                example: 'Conecta cada LED a un pin digital a través de su resistencia y une el circuito a GND.',
                icon: '🔌'
            },
            programming: {
                title: '4. Programa y prueba',
                description: 'Escribe el programa, cárgalo en la placa y observa el resultado. Si algo no funciona como esperas, revisa el código y las conexiones y vuelve a probar.',
                example: 'Programa los tres LED para encenderse en secuencia con una pausa entre cada color.',
                icon: '</>'
            }
        };
        const exploredSteps = new Set();

        const showStep = (step, index) => {
            const description = descriptions[step.dataset.buildStep];

            if (!description) {
                console.error(`No se encontró la descripción para el paso "${step.dataset.buildStep}".`);
                return;
            }

            detail.classList.add('is-updating');
            detail.getBoundingClientRect();

            steps.forEach((item) => {
                item.setAttribute('aria-pressed', String(item === step));
            });

            exploredSteps.add(step.dataset.buildStep);
            stepStatus.textContent = `Paso ${index + 1} de ${steps.length}`;
            detailTitle.textContent = description.title;
            detailDescription.textContent = description.description;
            detailExample.innerHTML = '';

            const exampleLabel = document.createElement('strong');
            exampleLabel.textContent = 'Ejemplo práctico: ';
            detailExample.append(exampleLabel, description.example);
            detailIcon.textContent = description.icon;
            exploredLabel.textContent = `${exploredSteps.size} de ${steps.length} pasos explorados`;
            progress.setAttribute('aria-valuenow', String(exploredSteps.size));
            progressBar.style.width = `${(exploredSteps.size / steps.length) * 100}%`;

            window.requestAnimationFrame(() => {
                detail.classList.remove('is-updating');
            });
        };

        steps.forEach((step, index) => {
            step.addEventListener('click', () => showStep(step, index));
        });

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }

        if (!window.gsap || !window.ScrollTrigger) {
            console.error('No se pudo iniciar la animación de la guía: GSAP o ScrollTrigger no están disponibles.');
            return;
        }

        window.gsap.registerPlugin(window.ScrollTrigger);
        if (guide.getBoundingClientRect().top <= window.innerHeight * 0.78) {
            window.gsap.set(guide, { autoAlpha: 1, y: 0 });
            return;
        }

        window.gsap.fromTo(
            guide,
            { autoAlpha: 0, y: 20 },
            {
                immediateRender: false,
                autoAlpha: 1,
                y: 0,
                duration: 0.7,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: guide,
                    start: 'top 78%',
                    once: true
                }
            }
        );
        window.gsap.fromTo(
            steps,
            { autoAlpha: 0, y: 14 },
            {
                immediateRender: false,
                autoAlpha: 1,
                y: 0,
                duration: 0.45,
                ease: 'power2.out',
                stagger: 0.12,
                scrollTrigger: {
                    trigger: guide,
                    start: 'top 78%',
                    once: true
                }
            }
        );
    })();

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && hamburgerBtn.getAttribute('aria-expanded') === 'true') {
            setMenuOpen(false);
            hamburgerBtn.focus();
        }
    });

    window.matchMedia('(min-width: 1024px)').addEventListener('change', (event) => {
        if (event.matches) {
            setMenuOpen(false);
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const faq = document.querySelector('#Preguntas');
    const items = faq ? Array.from(faq.querySelectorAll('.arduino-faq__item')) : [];

    if (!faq || items.length !== 5) {
        console.error('No se pudo iniciar el FAQ: la sección o sus cinco preguntas no están disponibles.');
        return;
    }

    const setItemOpen = (item, isOpen) => {
        const button = item.querySelector('.arduino-faq__question');
        const answerId = button ? button.getAttribute('aria-controls') : null;
        const answer = answerId ? faq.querySelector(`#${answerId}`) : null;

        if (!button || !answer) {
            console.error('No se pudo actualizar una pregunta del FAQ: faltan el botón o su respuesta.');
            return;
        }

        item.classList.toggle('is-open', isOpen);
        button.setAttribute('aria-expanded', String(isOpen));
        answer.setAttribute('aria-hidden', String(!isOpen));
    };

    items.forEach((item) => {
        const button = item.querySelector('.arduino-faq__question');

        if (!button) {
            console.error('No se pudo iniciar una pregunta del FAQ: falta el botón.');
            return;
        }

        button.addEventListener('click', () => {
            const willOpen = button.getAttribute('aria-expanded') !== 'true';

            items.forEach((otherItem) => {
                setItemOpen(otherItem, otherItem === item && willOpen);
            });
        });
    });

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
    }

    if (!window.gsap || !window.ScrollTrigger) {
        console.error('No se pudo iniciar la animación del FAQ: GSAP o ScrollTrigger no están disponibles.');
        return;
    }

    window.gsap.registerPlugin(window.ScrollTrigger);

    if (faq.getBoundingClientRect().top <= window.innerHeight * 0.78) {
        return;
    }

    window.gsap.fromTo(
        items,
        { autoAlpha: 0, y: 20 },
        {
            immediateRender: false,
            autoAlpha: 1,
            y: 0,
            duration: 0.5,
            ease: 'power3.out',
            stagger: 0.1,
            scrollTrigger: {
                trigger: faq,
                start: 'top 78%',
                once: true
            }
        }
    );
});

                                                // SECTION 2 ¿Que es Arduino?

document.addEventListener('DOMContentLoaded', () => {
    const carousel = document.querySelector('#arduino-essentials-carousel');

    if (carousel) {
        if (typeof window.Swiper !== 'function') {
            console.error('No se pudo iniciar el carrusel de Arduino: Swiper.js no está disponible.');
        } else {
            new window.Swiper(carousel, {
                slidesPerView: 1,
                spaceBetween: 14,
                grabCursor: true,
                watchOverflow: true,
                navigation: {
                    nextEl: '.arduino-swiper-next',
                    prevEl: '.arduino-swiper-prev'
                },
                pagination: {
                    el: '.arduino-swiper-pagination',
                    clickable: true
                },
                a11y: {
                    prevSlideMessage: 'Tarjeta anterior',
                    nextSlideMessage: 'Tarjeta siguiente',
                    paginationBulletMessage: 'Ir a la tarjeta {{index}}'
                },
                breakpoints: {
                    600: {
                        slidesPerView: 2,
                        spaceBetween: 16
                    },
                    960: {
                        slidesPerView: 3,
                        spaceBetween: 20
                    }
                }
            });

            document.addEventListener('DOMContentLoaded', () => {
                const section = document.querySelector('#Materiales');
                const cards = section ? section.querySelectorAll('.materials-card') : [];

                if (!section || cards.length === 0 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                    return;
                }

                if (!window.gsap || !window.ScrollTrigger) {
                    console.error('No se pudo iniciar la animación de Materiales: GSAP o ScrollTrigger no están disponibles.');
                    return;
                }

                window.gsap.registerPlugin(window.ScrollTrigger);
                window.gsap.from(cards, {
                    autoAlpha: 0,
                    y: 24,
                    duration: 0.8,
                    ease: 'power3.out',
                    stagger: 0.12,
                    scrollTrigger: {
                        trigger: section,
                        start: 'top 78%',
                        once: true
                    }
                });
            });
        }
    }

    const board = document.querySelector('#arduino-board-card');
    const infoTitle = document.querySelector('#arduino-board-info-title');
    const infoText = document.querySelector('#arduino-board-info-text');
    const hotspots = document.querySelectorAll('.arduino-hotspot');

    if (!board || !infoTitle || !infoText || hotspots.length === 0) {
        return;
    }

    const descriptions = {
        usb: {
            title: 'Conexión USB',
            text: 'Permite conectar la placa al ordenador para cargar programas y, según la placa, recibir alimentación.'
        },
        cpu: {
            title: 'Microcontrolador',
            text: 'Ejecuta el programa y coordina las señales que recibe de los componentes conectados.'
        },
        pins: {
            title: 'Pines de entrada y salida',
            text: 'Conectan la placa con sensores y actuadores para leer señales o controlar componentes.'
        }
    };

    const showPart = (hotspot) => {
        const description = descriptions[hotspot.dataset.part];

        if (!description) {
            return;
        }

        infoTitle.textContent = description.title;
        infoText.textContent = description.text;
    };

    hotspots.forEach((hotspot) => {
        hotspot.addEventListener('pointerenter', () => showPart(hotspot));
        hotspot.addEventListener('focus', () => showPart(hotspot));
        hotspot.addEventListener('click', () => {
            hotspots.forEach((item) => {
                item.setAttribute('aria-pressed', String(item === hotspot));
            });
            showPart(hotspot);
        });
    });

    const canUseTilt = window.matchMedia(
        '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)'
    );

    if (canUseTilt.matches) {
        board.addEventListener('pointermove', (event) => {
            const bounds = board.getBoundingClientRect();
            const x = (event.clientX - bounds.left) / bounds.width;
            const y = (event.clientY - bounds.top) / bounds.height;

            board.style.transform =
                `perspective(900px) rotateX(${(0.5 - y) * 5}deg) rotateY(${(x - 0.5) * 5}deg)`;
        });

        board.addEventListener('pointerleave', () => {
            board.style.transform = '';
        });
    }
});
