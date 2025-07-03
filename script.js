// Global variables
let currentStep = 0
let totalSteps = 0
let walkthroughActive = false
const completedSteps = new Set()

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  initializeApp()
})

function initializeApp() {
  totalSteps = document.querySelectorAll(".process-step").length
  updateProgress()

  // Add event listeners for keyboard navigation
  document.addEventListener("keydown", handleKeyboardNavigation)

  // Initialize tooltips
  initializeTooltips()
}

// Card collapse/expand functionality
function toggleCard(cardId) {
  const card = document.getElementById(cardId)
  const content = card.querySelector(".card-content")
  const icon = card.querySelector(".collapse-icon")

  if (content.classList.contains("hidden")) {
    content.classList.remove("hidden")
    icon.classList.remove("rotated")
    card.classList.remove("collapsed")
  } else {
    content.classList.add("hidden")
    icon.classList.add("rotated")
    card.classList.add("collapsed")
  }
}

function expandAll() {
  const cards = document.querySelectorAll(".card")
  cards.forEach((card) => {
    const content = card.querySelector(".card-content")
    const icon = card.querySelector(".collapse-icon")
    if (content && icon) {
      content.classList.remove("hidden")
      icon.classList.remove("rotated")
      card.classList.remove("collapsed")
    }
  })
}

function collapseAll() {
  const cards = document.querySelectorAll(".card")
  cards.forEach((card) => {
    const content = card.querySelector(".card-content")
    const icon = card.querySelector(".collapse-icon")
    if (content && icon) {
      content.classList.add("hidden")
      icon.classList.add("rotated")
      card.classList.add("collapsed")
    }
  })
}

// Step information display
function showStepInfo(stepId, description) {
  const stepInfo = document.getElementById("stepInfo")
  const title = document.getElementById("stepInfoTitle")
  const content = document.getElementById("stepInfoContent")

  const stepTitles = {
    start: "Process Start",
    bo1: "Create BO-1 Order",
    transfer: "Wine Transfer",
    receive: "Wine Reception",
    waiting: "Waiting Period",
    end1: "Scenario 1 End",
    bo2: "Create BO-2 Order",
    reserves: "Reserve Transfer",
    invoice: "Invoice Generation",
    decision: "Replenishment Decision",
    delete: "Quantity Deletion",
    adjust: "Quantity Adjustment",
    end2a: "Sale End (No Replenishment)",
    end2b: "Sale End (With Replenishment)",
    bo3: "Create BO-3 Order",
    reserves3: "Reserve Transfer (Withdrawal)",
    delete3: "Quantity Deletion (Withdrawal)",
    return: "Return Transfer",
    end3: "Withdrawal End",
  }

  title.textContent = stepTitles[stepId] || "Step Information"
  content.textContent = description
  stepInfo.classList.add("visible")

  // Mark step as completed
  completedSteps.add(stepId)
  updateProgress()

  // Add visual feedback
  const stepElement = event.target.closest(".process-step")
  if (stepElement) {
    stepElement.classList.add("active")
    setTimeout(() => {
      stepElement.classList.remove("active")
    }, 1000)
  }
}

// Progress tracking
function updateProgress() {
  const progressFill = document.getElementById("progressFill")
  const progress = (completedSteps.size / totalSteps) * 100
  progressFill.style.width = progress + "%"
}

function resetProgress() {
  completedSteps.clear()
  updateProgress()

  // Remove completed styling
  document.querySelectorAll(".step-box.completed").forEach((box) => {
    box.classList.remove("completed")
  })

  // Hide step info
  document.getElementById("stepInfo").classList.remove("visible")
}

// Walkthrough functionality
function startWalkthrough() {
  walkthroughActive = true
  currentStep = 0
  expandAll()

  // Highlight first step
  highlightCurrentStep()

  // Show instructions
  showModal(
    "Walkthrough Started",
    'Use the arrow keys or click "Next Step" to navigate through the process. Press ESC to exit walkthrough mode.',
  )
}

function highlightCurrentStep() {
  // Remove previous highlights
  document.querySelectorAll(".card.highlighted").forEach((card) => {
    card.classList.remove("highlighted")
  })

  // Highlight current card
  const cards = document.querySelectorAll(".card")
  if (cards[currentStep]) {
    cards[currentStep].classList.add("highlighted")
    cards[currentStep].scrollIntoView({ behavior: "smooth", block: "center" })
  }
}

function nextStep() {
  if (currentStep < document.querySelectorAll(".card").length - 1) {
    currentStep++
    highlightCurrentStep()
  }
}

function previousStep() {
  if (currentStep > 0) {
    currentStep--
    highlightCurrentStep()
  }
}

// Keyboard navigation
function handleKeyboardNavigation(event) {
  if (!walkthroughActive) return

  switch (event.key) {
    case "ArrowRight":
    case "ArrowDown":
      event.preventDefault()
      nextStep()
      break
    case "ArrowLeft":
    case "ArrowUp":
      event.preventDefault()
      previousStep()
      break
    case "Escape":
      event.preventDefault()
      exitWalkthrough()
      break
  }
}

function exitWalkthrough() {
  walkthroughActive = false
  document.querySelectorAll(".card.highlighted").forEach((card) => {
    card.classList.remove("highlighted")
  })
}

// Role highlighting
function highlightRole(roleType) {
  // Remove previous highlights
  document.querySelectorAll(".process-step").forEach((step) => {
    step.style.opacity = "1"
  })

  const roleSelectors = {
    horeca: ".purple-scheme",
    salesperson: ".blue-scheme",
    assistant: ".yellow-scheme",
    logistics: ".green-scheme",
  }

  const selector = roleSelectors[roleType]
  if (selector) {
    // Dim all steps
    document.querySelectorAll(".process-step").forEach((step) => {
      step.style.opacity = "0.3"
    })

    // Highlight selected role steps
    document.querySelectorAll(selector + " .process-step, .process-step" + selector).forEach((step) => {
      step.style.opacity = "1"
      step.style.transform = "scale(1.05)"
    })

    // Reset after 3 seconds
    setTimeout(() => {
      document.querySelectorAll(".process-step").forEach((step) => {
        step.style.opacity = "1"
        step.style.transform = "scale(1)"
      })
    }, 3000)
  }
}

// Modal functionality
function showModal(title, content) {
  document.getElementById("modalTitle").textContent = title
  document.getElementById("modalContent").innerHTML = content
  document.getElementById("detailModal").style.display = "block"
}

function closeModal() {
  document.getElementById("detailModal").style.display = "none"
}

function showOrderDetails(orderType) {
  const orderDetails = {
    bo1: {
      title: "BO-1: Initial Consignment Order",
      content: `
                <h4>Purpose:</h4>
                <p>Establishes the initial consignment relationship between the wine supplier and the Horeca client.</p>
                
                <h4>Key Details:</h4>
                <ul>
                    <li><strong>Location:</strong> CH-EXT (Client's external location)</li>
                    <li><strong>Reserve Source:</strong> CH Stock (Central warehouse)</li>
                    <li><strong>Ownership:</strong> Remains with supplier until sold</li>
                    <li><strong>Purpose:</strong> Track consigned wine inventory</li>
                </ul>
                
                <h4>Process Flow:</h4>
                <p>Created by salesperson → Wine transferred → Client receives wine → Wine available for use</p>
            `,
    },
    bo2: {
      title: "BO-2: Sales Order",
      content: `
                <h4>Purpose:</h4>
                <p>Processes the sale of consigned wine when the client decides to purchase.</p>
                
                <h4>Key Details:</h4>
                <ul>
                    <li><strong>Location:</strong> CH-EXT (Where wine is located)</li>
                    <li><strong>Reserve Source:</strong> From BO-1 (Consigned inventory)</li>
                    <li><strong>Ownership:</strong> Transfers to client upon invoicing</li>
                    <li><strong>Purpose:</strong> Invoice and sell consigned wine</li>
                </ul>
                
                <h4>Decision Point:</h4>
                <p>After sale, salesperson decides whether to replenish the consignment or close it.</p>
            `,
    },
    bo3: {
      title: "BO-3: Withdrawal Order",
      content: `
                <h4>Purpose:</h4>
                <p>Handles the return of unwanted or rejected consigned wine back to the warehouse.</p>
                
                <h4>Key Details:</h4>
                <ul>
                    <li><strong>Location:</strong> CH (Central warehouse - destination)</li>
                    <li><strong>Reserve Source:</strong> CH-EXT (Client location)</li>
                    <li><strong>Ownership:</strong> Remains with supplier</li>
                    <li><strong>Purpose:</strong> Return rejected or unwanted wine</li>
                </ul>
                
                <h4>Process Flow:</h4>
                <p>Create BO-3 → Transfer reserves → Delete from BO-1 → Physical return → Complete</p>
            `,
    },
  }

  const details = orderDetails[orderType]
  if (details) {
    showModal(details.title, details.content)
  }
}

// Initialize tooltips
function initializeTooltips() {
  const steps = document.querySelectorAll(".process-step")
  steps.forEach((step) => {
    step.addEventListener("mouseenter", function () {
      // Add hover effect
      this.style.transform = "translateY(-2px)"
    })

    step.addEventListener("mouseleave", function () {
      // Remove hover effect
      this.style.transform = "translateY(0)"
    })
  })
}

// Close modal when clicking outside
window.onclick = (event) => {
  const modal = document.getElementById("detailModal")
  if (event.target === modal) {
    closeModal()
  }
}

// Add animation for completed steps
function markStepCompleted(stepElement) {
  const stepBox = stepElement.querySelector(".step-box")
  if (stepBox) {
    stepBox.classList.add("completed")

    // Add checkmark animation
    const checkmark = document.createElement("div")
    checkmark.innerHTML = "✓"
    checkmark.style.cssText = `
            position: absolute;
            top: -10px;
            right: -10px;
            background: #10b981;
            color: white;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            animation: bounceIn 0.5s ease;
        `

    stepBox.style.position = "relative"
    stepBox.appendChild(checkmark)
  }
}

// Add CSS animation for bounce effect
const style = document.createElement("style")
style.textContent = `
    @keyframes bounceIn {
        0% { transform: scale(0); }
        50% { transform: scale(1.2); }
        100% { transform: scale(1); }
    }
`
document.head.appendChild(style)

// Export functions for potential external use
window.WineConsignmentApp = {
  toggleCard,
  expandAll,
  collapseAll,
  showStepInfo,
  startWalkthrough,
  resetProgress,
  highlightRole,
  showOrderDetails,
}
