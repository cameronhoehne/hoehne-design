const sliderContainer = document.querySelector(".container");
const animDelay = document.getElementsByClassName("portfolio-item");
const main = document.body.querySelector(".portfolio-grid");
let lastChild = main.lastChild;

function getPortfolioItems() {
    return document.querySelectorAll(".portfolio-item");
}

//slider centering
function isOverflown(element) {
    return element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth;
}


function mainWindowLoad() {
    for (item of animDelay) {
        let num = Math.random() / 2;
        item.style.transitionDelay = `${num}s`
        void item.offsetWidth;
        item.classList.add("fade-in-up");
    }
};

mainWindowLoad();

//modal

const modal = document.getElementById("video-modal");
const modalBackground = document.querySelector(".modal-content");
const modalPrev = document.querySelector(".modal-prev");
const modalNext = document.querySelector(".modal-next");
const modalSlider = document.querySelector(".modal-slider");


let currIdx = 0;
let slidesArray = [];
let isModalOpen = false;

function openModal(index) {
    slidesArray = [];
    currIdx = index;
    const items = getPortfolioItems();
    slidesArray = Array.from(items).map(item => {
        const link = item.querySelector(".portfolio-link").getAttribute("href");
        const iframe = document.createElement("iframe");
        iframe.src = link + "?&autoplay=1";
        iframe.allow = "autoplay; fullscreen";
        iframe.width = "560";
        iframe.height = "315";

        const iframeWrapper = document.createElement("div");
        iframeWrapper.classList.add("iframe-wrapper");
        iframeWrapper.appendChild(iframe);
        return iframeWrapper;
    })
    const close = document.createElement("div");
    close.innerHTML = "X";
    close.classList.add("modal-close");
    close.addEventListener("click", handleModalClose);
    modalSlider.innerHTML = "";
    modalSlider.appendChild(close);
    modalSlider.append(slidesArray[currIdx]);
    slidesArray[currIdx].classList.add("active");
    modal.style.display = "flex";
    //show slider here
    scrollToItem(currIdx);
    if (!isModalOpen) {

        main.classList.add("disabled")
        isModalOpen = true;
    }
};

function loadSlide(index) {
    modalSlider.innerHTML = "";
    const close = document.createElement("div");
    close.innerHTML = "X";
    close.classList.add("modal-close");
    close.addEventListener("click", handleModalClose);
    const currSlide = slidesArray[index];
    modalSlider.appendChild(close)
    modalSlider.append(currSlide)
}

function handleLinkClick(e) {
    e.preventDefault();

    openModal(this.index);
}

function addModalLinks() {
    const items = getPortfolioItems();
    items.forEach((item, index) => {
        const link = item.querySelector(".portfolio-link");
        link.removeEventListener("click", handleLinkClick);
        link.index = index;
        link.addEventListener("click", handleLinkClick);
    });
}

addModalLinks();

function handleModalClose() {
    const links = document.querySelectorAll(".thumb-slider");
    links.forEach((item) => {
        item.classList.remove("active")
    })
    modal.style.display = "none";
    modalSlider.innerHTML = "";
    sliderContainer.classList.add("center-slider");
    if (isModalOpen) {
        main.classList.remove("disabled");
        isModalOpen = false;
    }
}

modalPrev.addEventListener("click", () => {
    currIdx = (currIdx > 0) ? currIdx - 1 : slidesArray.length - 1;
    loadSlide(currIdx);
    scrollToItem(currIdx, "previous");
});

modalNext.addEventListener("click", () => {
    currIdx = (currIdx < slidesArray.length - 1) ? currIdx + 1 : 0;
    loadSlide(currIdx);
    scrollToItem(currIdx, "next");
});

function handleTapOrClick(e) {
    if (e.target == modalBackground) {
        const links = document.querySelectorAll(".thumb-slider");
        links.forEach((item) => {
            item.classList.remove("active");
        });

        modal.style.display = "none";
        modalSlider.innerHTML = "";
        sliderContainer.classList.add("center-slider");

        if (isModalOpen) {
            setTimeout(() => {
                main.classList.remove("disabled");
                isModalOpen = false;
            }, 100);

        }
    }
}

window.addEventListener('click', handleTapOrClick);
window.addEventListener('touchstart', handleTapOrClick);

// Scroller
function getSliderItems() {
    return document.querySelectorAll(".portfolio-item-slider");
}

function addModalLinksToSlider() {
    const items = getSliderItems();
    items.forEach((item, index) => {
        const sliderLink = item.querySelector(".portfolio-link-slider");
        sliderLink.removeEventListener("click", handleLinkClick);
        sliderLink.index = index;
        sliderLink.addEventListener("click", handleLinkClick);
    });
}

addModalLinksToSlider();

//scroll to
function scrollToItem(idx, direction) {
    const array = Array.from(sliderContainer.children);
    const thumbnail = array[currIdx].children[0];

    //set selected index to show active border
    let prevIdx;
    if (direction === "next") {

        prevIdx = (idx > 0) ? idx - 1 : array.length - 1;
        if (array[prevIdx].children[0].classList.contains("active")) {
            array[prevIdx].children[0].classList.remove("active")
        }
    } else if (direction === "previous") {
        prevIdx = (idx < array.length - 1) ? idx + 1 : 0;
        if (array[prevIdx].children[0].classList.contains("active")) {
            array[prevIdx].children[0].classList.remove("active")
        }
    }
    array.forEach(item => {
        if (item.children[0].classList.contains("active")) {
            item.children[0].classList.remove("active")
        }
    })
    thumbnail.classList.add("active");
    setTimeout(() => {
        thumbnail.scrollIntoView({
            behavior: "smooth",
            inline: "center"
        });
    }, 10);
    if (isOverflown(sliderContainer)) {
        console.log('yes');

        sliderContainer.classList.remove("center-slider");
    } else {
        console.log('nothing');

    }

}


//DATA
let portfolioData;
document.addEventListener('DOMContentLoaded', function () {
    // Select the script element containing JSON data
    const portfolioDataScript = document.querySelector('#portfolioData');

    // Extract the text content
    const encodedJSON = portfolioDataScript.textContent;

    // Create a temporary DOM element to decode HTML entities
    const tempElement = document.createElement('div');
    tempElement.style.display = 'none';  // Hide the element
    document.body.appendChild(tempElement);  // Append it to the body

    // Set the encoded JSON content to the temporary element
    tempElement.innerHTML = encodedJSON;

    // Get the decoded JSON string
    const decodedJSON = tempElement.textContent;

    // Remove the temporary element from the DOM
    document.body.removeChild(tempElement);

    try {
        // Parse the JSON string
        portfolioData = JSON.parse(decodedJSON);


    } catch (e) {
        console.error('Failed to parse JSON:', e);
    }
    const containerDiv = document.querySelector(".portfolio-grid");
    function loadMore(itemNumber) {

        const oldlastChild = main.lastChild;
        let itemsAdded = 0;
        let wereItemsAdded = false;
        lastCardNumber = itemNumber;

        for (item of portfolioData) {
            if (itemsAdded >= 3) {
                break;
            }

            if (lastCardNumber < portfolioData.length && item.id == lastCardNumber) {
                wereItemsAdded = true;
                let num = Math.random() / 2;
                const div = document.createElement('div');
                div.style.transitionDelay = `${num}s`
                void div.offsetWidth;
                div.classList.add('portfolio-item');

                div.setAttribute('data-category', item.category);
                div.innerHTML = `
                <div class="portfolio-picture">
                    <div class="hover-thumb" style="background-image: url(${item.gif})"></div>
                    <div class="thumb" style="background-image: url(${item.image})"></div>
                    <a href="${item.link}" class="portfolio-link"></a>
                    <div class="item-description">
                        <h2>${item.title}</h2>
                        <p>${item.description}</p>
                    </div>
                 </div>
                `;
                containerDiv.appendChild(div);
                setTimeout(() => {
                    div.classList.add('fade-in-up'); // Now add the animation class
                }, 100);

                const sliderDiv = document.createElement('div');
                sliderDiv.classList.add('portfolio-item-slider');

                sliderDiv.setAttribute('data-category', item.category);
                sliderDiv.innerHTML = `
                     <div class="thumb-slider" style="background-image: url(${item.image})">
                     <a href="${item.link}" class="portfolio-link-slider"></a>
                     </div>
                    
                `;

                sliderContainer.appendChild(sliderDiv);
                lastCardNumber++;
                itemsAdded++;
                if (isOverflown(sliderContainer)) {
                    sliderContainer.classList.remove("center-slider");
                }
            }
        }
        if (wereItemsAdded) {
            observer.unobserve(oldlastChild);
            lastChild = main.lastChild;
            observer.observe(lastChild)
            addModalLinks();
            addModalLinksToSlider();
        } else {
            observer.unobserve(oldlastChild);
        }
    }

    const observer = new IntersectionObserver(entries => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const items = getPortfolioItems();
                let mainWindowItemsArray = Array.from(items);
                loadMore(mainWindowItemsArray.length);
            }
        })
    },
        {
            root: null,
            rootMargin: "0px",
            threshold: .5
        });
    observer.observe(lastChild);

    //filter
    const allFilterButtons = document.querySelectorAll(".filter-button");


    const filterAllButton = document.getElementById("filter-all-btn");
    filterAllButton.addEventListener("click", (e) => {
        filterPortfolioItems(e.target.attributes[2].value)
        allFilterButtons.forEach(button => {
            button.classList.remove("active")
        });
        e.target.classList.add("active");
    });
    const filterMotionGraphicsButton = document.getElementById("motion-graphics-btn");
    filterMotionGraphicsButton.addEventListener("click", (e) => {
        filterPortfolioItems(e.target.attributes[2].value);
        allFilterButtons.forEach(button => {
            button.classList.remove("active")
        });
        e.target.classList.add("active");

    });
    const filterInfographicsButton = document.getElementById("infographics-btn");
    filterInfographicsButton.addEventListener("click", (e) => {
        filterPortfolioItems(e.target.attributes[2].value);
        allFilterButtons.forEach(button => {
            button.classList.remove("active")
        });
        e.target.classList.add("active");

    });
    const filterCharacterAnimButton = document.getElementById("character-anim-btn");
    filterCharacterAnimButton.addEventListener("click", (e) => {
        filterPortfolioItems(e.target.attributes[2].value);
        allFilterButtons.forEach(button => {
            button.classList.remove("active")
        });
        e.target.classList.add("active");
    });
    const filterVideoEditButton = document.getElementById("video-editing-btn");
    filterVideoEditButton.addEventListener("click", (e) => {
        filterPortfolioItems(e.target.attributes[2].value);
        allFilterButtons.forEach(button => {
            button.classList.remove("active")
        });
        e.target.classList.add("active");
    });
    const filterRetailButton = document.getElementById("retail-btn");
    filterRetailButton.addEventListener("click", (e) => {
        filterPortfolioItems(e.target.attributes[2].value);
        allFilterButtons.forEach(button => {
            button.classList.remove("active")
        });
        e.target.classList.add("active");
    });

    function filterPortfolioItems(itemCategory) {

        main.innerHTML = "";
        sliderContainer.innerHTML = "";
        for (item of portfolioData) {
            for (category of item.category) {



                if (category === itemCategory) {
                    let num = Math.random() / 2;
                    const div = document.createElement('div');
                    div.style.transitionDelay = `${num}s`
                    void div.offsetWidth;
                    div.classList.add('portfolio-item');

                    div.setAttribute('data-category', item.category);
                    div.innerHTML = `
                    <div class="portfolio-picture">
                        <div class="hover-thumb" style="background-image: url(${item.gif})"></div>
                        <div class="thumb" style="background-image: url(${item.image})"></div>
                        <a href="${item.link}" class="portfolio-link"></a>
                        <div class="item-description">
                            <h2>${item.title}</h2>
                            <p>${item.description}</p>
                        </div>
                     </div>
                    `;
                    main.appendChild(div);
                    setTimeout(() => {
                        div.classList.add('fade-in-up'); // Now add the animation class
                    }, 100);

                    const sliderDiv = document.createElement('div');
                    sliderDiv.classList.add('portfolio-item-slider');

                    sliderDiv.setAttribute('data-category', item.category);
                    sliderDiv.innerHTML = `
                         <div class="thumb-slider" style="background-image: url(${item.image})">
                         <a href="${item.link}" class="portfolio-link-slider"></a>
                         </div>
                        
                    `;

                    sliderContainer.appendChild(sliderDiv);
                }
            }

        }
        addModalLinks();
        addModalLinksToSlider();
    }








});
