function handleScrollAnimations() {
    const animatedElements = document.querySelectorAll('.info-card, .project-card, .skill-category, .experience-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });

    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

function addLoadAnimations() {
    const header = document.querySelector('.header-content');
    if (header) {
        header.style.opacity = '0';
        setTimeout(() => {
            header.style.opacity = '1';
            header.style.animation = 'fadeInUp 1s ease forwards';
        }, 300);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.slide');
    
    if (slides.length === 0) {
        return;
    }

    let currentSlide = 0;

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        slides[index].classList.add('active');
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    showSlide(0);
    setInterval(nextSlide, 2500);

    addLoadAnimations();
    handleScrollAnimations();

    const sections = document.querySelectorAll('.section');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                if (entry.target.classList.contains('experience-card') || 
                    entry.target.classList.contains('project-card')) {
                    entry.target.style.transitionDelay = entry.target.dataset.delay || '0ms';
                }
                
                if (entry.target.classList.contains('section')) {
                    const cards = entry.target.querySelectorAll('.experience-card, .skill-category');
                    cards.forEach((card, index) => {
                        setTimeout(() => {
                            card.classList.add('visible');
                        }, index * 200);
                    });
                }
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    document.querySelectorAll('.skill-item').forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.transform = 'scale(1.1)';
        });
        item.addEventListener('mouseleave', () => {
            item.style.transform = 'scale(1)';
        });
    });
});

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

document.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});

document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const activeModal = document.querySelector('.modal.active');
        if (activeModal) {
            activeModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }
});

function togglePixVerification() {
    const verification = document.querySelector('.pix-verification');
    verification.classList.toggle('active');
}

document.addEventListener('click', function(event) {
    if (event.target.classList.contains('pix-verification')) {
        event.target.classList.remove('active');
    }
});

function toggleFranceIOICurve() {
    const curve = document.querySelector('.france-ioi-curve');
    if (curve) {
        curve.classList.toggle('active');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const closeCurve = document.querySelector('.close-curve');
    if (closeCurve) {
        closeCurve.addEventListener('click', function() {
            const curve = document.querySelector('.france-ioi-curve');
            if (curve) {
                curve.classList.remove('active');
            }
        });
    }

    const curveImage = document.querySelector('.france-ioi-curve img');
    if (curveImage) {
        curveImage.addEventListener('click', function() {
            const imageModal = document.querySelector('.image-modal');
            const modalImg = imageModal.querySelector('img');
            modalImg.src = this.src;
            imageModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }
});

document.addEventListener('click', function(event) {
    if (event.target.classList.contains('france-ioi-curve')) {
        event.target.classList.remove('active');
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const imageModal = document.querySelector('.image-modal');
    const modalImg = imageModal.querySelector('img');
    const closeImage = imageModal.querySelector('.close-image');

    document.querySelectorAll('.modal-body img').forEach(img => {
        img.addEventListener('click', function() {
            imageModal.classList.add('active');
            modalImg.src = this.src;
            document.body.style.overflow = 'hidden';
        });
    });

    closeImage.addEventListener('click', function() {
        imageModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    });

    imageModal.addEventListener('click', function(e) {
        if (e.target === imageModal) {
            imageModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && imageModal.classList.contains('active')) {
            imageModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
});

function filterGames(category) {
    const gameCards = document.querySelectorAll('.game-card');
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(btn => {
        if (btn.getAttribute('data-filter') === category) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    gameCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        
        if (category === 'all') {
            card.style.display = 'block';
        } else if (cardCategory === category) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const gameCards = document.querySelectorAll('.game-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            filterGames(this.getAttribute('data-filter'));
        });
    });

    filterGames('all');

    const backToTopButton = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
    });

    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            const filterValue = this.getAttribute('data-filter');

            projectCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    const skillBars = document.querySelectorAll('.skill-progress');
    const observerOptions = {
        threshold: 0.5
    };

    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.width = entry.target.getAttribute('data-width') || '0%';
            }
        });
    }, observerOptions);

    skillBars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0';
        bar.setAttribute('data-width', width);
        skillObserver.observe(bar);
    });

    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Message envoyé avec succès !');
            contactForm.reset();
        });
    }
});

window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

const slides = document.querySelectorAll('.slide');
let currentSlide = 0;

function showSlide(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    slides[index].classList.add('active');
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
}

setInterval(nextSlide, 3000);

const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.info-card, .project-card, .skill-category').forEach(el => {
    observer.observe(el);
});

const backToTop = document.createElement('button');
backToTop.className = 'back-to-top';
backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
document.body.appendChild(backToTop);

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTop.classList.add('show');
    } else {
        backToTop.classList.remove('show');
    }
});

backToTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const transition = document.createElement('div');
    transition.className = 'page-transition';
    document.body.appendChild(transition);

    document.querySelectorAll('section').forEach(section => {
        section.classList.add('page-content');
    });

    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                transition.classList.add('active');

                setTimeout(() => {
                    targetSection.scrollIntoView({ behavior: 'smooth' });

                    setTimeout(() => {
                        transition.classList.remove('active');
                    }, 500);
                }, 500);
            }
        });
    });

    setTimeout(() => {
        document.querySelectorAll('.page-content').forEach(content => {
            content.classList.add('visible');
        });
    }, 100);
});