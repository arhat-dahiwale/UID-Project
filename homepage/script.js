document.addEventListener('DOMContentLoaded', function() {
    const planCards = document.querySelectorAll('.plan-card');
    const nextBtn = document.querySelector('.next-btn');
    let selectedPlan = null;

    // Plan selection
    planCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Don't trigger if clicking the select button (let button handle it)
            if (e.target.classList.contains('select-btn')) return;

            // Remove selected class from all cards
            planCards.forEach(c => c.classList.remove('selected'));
            
            // Add selected class to clicked card
            this.classList.add('selected');
            selectedPlan = this.getAttribute('data-plan');
            
            // Enable next button
            nextBtn.disabled = false;
        });

        // Also handle button clicks
        const btn = card.querySelector('.select-btn');
        btn.addEventListener('click', function() {
            // Remove selected class from all cards
            planCards.forEach(c => c.classList.remove('selected'));
            
            // Add selected class to parent card
            card.classList.add('selected');
            selectedPlan = card.getAttribute('data-plan');
            
            // Enable next button
            nextBtn.disabled = false;
        });
    });

    // Next button click
    nextBtn.addEventListener('click', function() {
        if (selectedPlan) {
            // In a real app, you would save the selected plan and proceed to the next step
            alert(`You selected the ${selectedPlan} plan. Proceeding to payment...`);
            // Here you would typically redirect to the payment page or show the next step
        }
    });
});

