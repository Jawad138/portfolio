$(document).ready(function() {
    // Smooth scrolling
    $('a.nav-link').on('click', function(event) {
        if (this.hash !== "") {
            event.preventDefault();
            var hash = this.hash;
            $('html, body').animate({
                scrollTop: $(hash).offset().top - 56
            }, 800);
        }
        
        // Collapse the navbar after clicking a link in mobile view
        if ($('.navbar-collapse').hasClass('show')) {
            $('.navbar-toggler').click();
        }
    });

    // Navbar background change on scroll
    $(window).scroll(function() {
        if ($(this).scrollTop() > 50) {
            $('.navbar').addClass('navbar-scrolled');
        } else {
            $('.navbar').removeClass('navbar-scrolled');
        }
    });

    // Form submission
    $('#contact-form').submit(function(e) {
        e.preventDefault();
        $.ajax({
            url: '/send_message',
            type: 'post',
            data: $('#contact-form').serialize(),
            success: function(response) {
                if (response.status === 'success') {
                    $('#form-status').html('<div class="alert alert-success">Message sent successfully!</div>');
                } else {
                    $('#form-status').html('<div class="alert alert-danger">An error occurred. Please try again.</div>');
                }
            }
        });
    });

    // Add animation to sections when scrolling
    $(window).on('scroll', function() {
        $('section').each(function() {
            if ($(this).isInViewport()) {
                $(this).find('.animate__animated').not('.animate__animated--triggered').each(function() {
                    $(this).addClass('animate__animated--triggered');
                    var animationClass = $(this).attr('class').split(' ').find(c => c.startsWith('animate__'));
                    $(this).addClass(animationClass);
                });
            }
        });
    });

    // Check if element is in viewport
    $.fn.isInViewport = function() {
        var elementTop = $(this).offset().top;
        var elementBottom = elementTop + $(this).outerHeight();
        var viewportTop = $(window).scrollTop();
        var viewportBottom = viewportTop + $(window).height();
        return elementBottom > viewportTop && elementTop < viewportBottom;
    };

    // Trigger animations for elements in view on page load
    $(window).trigger('scroll');

    // Contact form reset and fade-out message
    $('#contact-form').on('submit', function(e) {
        e.preventDefault();

        // Display success message
        $('#form-status').text('Thank you for your message. I will get back to you soon.').fadeIn();

        // Hide the success message after 5 seconds (5000 milliseconds)
        setTimeout(function() {
            $('#form-status').fadeOut();
        }, 5000);

        // Optionally reset the form
        $('#contact-form')[0].reset();
    });
});
