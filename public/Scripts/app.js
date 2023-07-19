//IIFE - Immediately Invoked Function Expression
(function()
    {
        function Start()
        {
            console.log("App Started...");

            let deleteButtons = document.querySelectorAll('.btn-danger')

            for(button of deleteButtons)
            {
                button.addEventListener('click', (event) => {
                    if(!confirm("Are you sure?"))
                    {
                        event.preventDefault();
                        window.location.assign('/survey/active_surveys');
                    }
                })
            }
        }

        window.addEventListener("load", Start);
})();

// Select the success and error message elements
const successMessageElement = document.getElementById('successMessage');
const errorMessageElement = document.getElementById('errorMessage');

// Function to hide or remove the message elements after a delay
function hideMessageElements() {
  if (successMessageElement) {
    successMessageElement.style.display = 'none'; // Hide the element
  }
  if (errorMessageElement) {
    errorMessageElement.remove(); // Remove the element from the DOM
  }
}

// Remove the message elements after 5 seconds
setTimeout(hideMessageElements, 5000); // 5000 milliseconds = 5 seconds