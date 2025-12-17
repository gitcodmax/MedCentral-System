document.addEventListener('DOMContentLoaded', () => {

    // Real-Time Clock Update
    const updateClock = () => {
        const now = new Date();

        // Time format (e.g., 10:45 AM)
        const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: true };
        document.getElementById('current-time').textContent = now.toLocaleTimeString('en-US', timeOptions);

        // Date format (e.g., WED, APR 16)
        const dateOptions = { weekday: 'short', month: 'short', day: 'numeric' };
        document.getElementById('current-date').textContent = now.toLocaleDateString('en-US', dateOptions).toUpperCase();
    };

    // Update immediately and then every minute
    updateClock();
    setInterval(updateClock, 60000);

    // --- 2. Quick Actions Simulation ---
    const actionButtons = document.querySelectorAll('.action-btn');

    actionButtons.forEach(button => {
        button.addEventListener('click', () => {
            const action = button.getAttribute('data-action');

            // Simple alert for demonstration purposes
            switch (action) {
                case 'receive-stock':
                    //alert('Action: Opening "Receive Stock" form...');

                    // --- Modal Control ---
                    const receiveStockBtn = document.querySelector('.js-receive-stock-btn');
                    const modal = document.getElementById('receiveStockModal');
                    const closeModalBtn = document.getElementById('closeModalBtn');

                    //Show Modal
                    if (receiveStockBtn) {
                        receiveStockBtn.addEventListener('click', (event) => {
                            console.log('Receive Stock Clicked')
                            event.preventDefault();
                            modal.classList.remove('hidden');
                            // Disable scrolling on the body when modal is open
                            document.body.style.overflow = 'hidden';
                        });
                    }

                    //Hide Modal Function
                    const hideModal = () => {
                        modal.classList.add('hidden');
                        document.body.style.overflow = ''; // Restore scrolling
                    };

                    //Hide Modal via Close Button
                    if (closeModalBtn) {
                        closeModalBtn.addEventListener('click', hideModal);
                    }

                    //Hide Modal by clicking the backdrop (outside the form)
                    if (modal) {
                        modal.addEventListener('click', (event) => {
                            if (event.target === modal) {
                                hideModal();
                            }
                        });
                    }

                    //Hide Modal via Escape key
                    document.addEventListener('keydown', (event) => {
                        if (event.key === 'Escape' && !modal.classList.contains('hidden')) {
                            hideModal();
                        }
                    });

                    break;
                case 'pick-orders':
                    alert('Action: Opening "Pick Orders" list interface...');
                    break;
                case 'stock-count':
                    alert('Action: Launching "Stock Count" cycle tool...');
                    break;
                case 'report-damage':
                    alert('Action: Opening "Report Damaged Items" form...');
                    break;
                case 'update-location':
                    alert('Action: Opening "Update Bin Location" tool...');
                    break;
                default:
                    console.log(`Action triggered: ${action}`);
            }
        });
    });

    // --- 3. Progress Bar Simulation (Based on Task Completion) ---
    const totalTasks = parseInt(document.getElementById('total-tasks').textContent);
    let completedTasks = parseInt(document.getElementById('completed-tasks').textContent);
    const progressBar = document.getElementById('progress-bar');

    const updateProgress = () => {
        if (totalTasks > 0) {
            const percentage = Math.round((completedTasks / totalTasks) * 100);
            progressBar.style.width = `${percentage}%`;
        }
    };

    // Simulate task completion when a picking list is completed
    const startPickingButton = document.querySelector('.picking-list-item button[data-order-id="MC-ORD-2034"]');

    if (startPickingButton) {
        startPickingButton.addEventListener('click', (event) => {
            event.preventDefault();

            // Simulate completion
            if (startPickingButton.textContent === 'Start Picking') {
                startPickingButton.textContent = 'Picking in Progress...';
                startPickingButton.classList.remove('primary');
                startPickingButton.classList.add('outline');

                document.getElementById('in-progress-tasks').textContent = '1 (Currently Picking #MC-ORD-2034)';

            } else if (startPickingButton.textContent === 'Picking in Progress...') {
                // On second click, simulate completion of the task
                alert('Order MC-ORD-2034 completed and sent to Packing!');

                completedTasks++;
                document.getElementById('completed-tasks').textContent = completedTasks;

                // Hide or remove the completed order
                startPickingButton.closest('.picking-list-item').style.display = 'none';

                document.getElementById('in-progress-tasks').textContent = '0 (None)';
                updateProgress();
            }
        });
    }

    // Initial progress bar load
    updateProgress();



});