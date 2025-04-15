body {
    margin: 0;
    font-family: 'Segoe UI';

    display: flex;
    align-items: center;
    justify-content: center;

    min-height: 100vh;

    background-color: var(--background-color);
    color: var(--text-color);

    transition: background-color 0.5s ease,
                color 0.5s ease;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    max-width: 800px;
    padding: 20px;
    box-sizing: border-box;
}

.controls {
    display: flex;
}

.data-text {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 15px;
    width: 100%;
    grid-auto-flow: row dense;
    position: relative; 
    perspective: 800px;
}

/* lite theme */
:root {
    --background-color: #f8f8f8;

    --track-background: #bebebec0;
    --track-line: #443f3f93;
    --track-gradient: #505050c2;

    --indicator-color: #525252bb;

    --output-glow: #000000;
    --text-color: #4d4d4dd4;

    --thumb-background: #7e7e7e;
    --thumb-hover-background: #585858e7;

    --thumb-hover-shadow: rgba(73, 73, 73, 0.705);
    --thumb-dragging-shadow: rgba(82, 82, 82, 0.8);
}

/* dark theme */
@media (prefers-color-scheme: dark) {
    :root {
        --background-color: #212121;
        --text-color: #c9c9c9c9;
        --track-background: #3d3d3da6;
        --track-line: #d4d8ee9d;
        --track-gradient: #4646468e;

        --indicator-color: #4d4d4d;

        --thumb-background: rgb(96, 97, 100);
        --thumb-hover-background: #979ca1;
        --thumb-hover-shadow: rgb(179, 181, 189);

        --thumb-dragging-shadow: rgb(166, 170, 175);

        --output-glow: #000000;
    }
}

.slider-data-wrapper {
    display: flex;
    flex-direction: row;
    align-items: center; 
    gap: 50px; 
    position: relative; 
}

.slider-container {
    width: 5px;
    height: 300px;
    position: relative;
    flex-shrink: 0;
    cursor: pointer;
}

.slider-track {
    position: relative;
    left: 50%;    
    top: 0;     
    height: 100%;   
    width: 5px;  
    transform: translateX(-50%); 

    background-color: var(--track-background, #ccc);
    border-radius: 3px;
    cursor: pointer;
    overflow: hidden;

    background-image: linear-gradient(0deg, transparent 0%, var(--track-gradient, #ccc) 50%, transparent 100%); 
    background-size: 100% 200%;
    background-position: 0 0;

    transition: background-position 0.3s ease;
    -webkit-mask-image: linear-gradient(0deg, transparent, white 15px, white calc(100% - 15px), transparent);
    mask-image: linear-gradient(0deg, transparent, white 15px, white calc(100% - 15px), transparent); 
}

.slider-indicator {
    position: absolute;
    left: 50%; 
    width: 5px;   
    height: 6px; 
    background-color: var(--track-background, #ccc);
    transform: translateX(-50%); 
}

.slider-indicator-left {
    top: 0;
}

.slider-indicator-right {
    bottom: 0; 
    top: auto;  
}

.slider-indicator-circle-container {
    position: absolute;
    left: 0%; 
    transform: translateX(-50%);
    display: flex;
    flex-direction: column; 
    justify-content: space-between;
    height: 100%; 
    pointer-events: none;
}

.slider-indicator-circle {
    position: relative;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: var(--track-background, #ccc);

    opacity: 0.35;

    filter: blur(2px);
    transition: opacity 0.3s ease, 
                filter 0.3s ease, 
                transform 0.3s ease, 
                width 0.3s ease, 
                border-radius 0.3s ease, 
                height 0.3s ease, 
                background-color 0.3s ease;
}

.slider-indicator-circle.active {
    opacity: 1;
    filter: blur(2px);
}

.slider-indicator-circle.inactive {
    opacity: 0;
    pointer-events: none;
}

.slider-indicator-circle-left {
    left: 3px; 
    top: -17px; 
}

.slider-indicator-circle-right {
    left: 3px; 
    bottom: -17px; 
    top: auto; 
}

.slider-indicator-circle.active.slider-indicator-circle-left {
    background-color: var(--indicator-color, #4a89e8);
    height: 6px; 
    width: 15px; 
    border-radius: 1;
    transform: translateY(-10px); 
    transition: background-color 0.3s ease, 
                width 0.3s ease, 
                height 0.3s ease, 
                transform 0.3s ease;
}

.slider-indicator-circle.active.slider-indicator-circle-right {
    background-color: var(--indicator-color, #4a89e8);

    height: 6px; 
    width: 15px; 
    border-radius: 1;

    transform: translateY(10px); 
    transition: background-color 0.3s ease, 
                width 0.3s ease, 
                height 0.3s ease, 
                transform 0.3s ease;
}

.slider-thumb {
    position: absolute;
    left: 50%;
    top: 0;
    width: 8px;
    height: 8px;

    background-color: var(--thumb-background, #007bff);

    border-radius: 50%;
    transform: translate(-50%, -50%); 

    cursor: grab;

    transition: background-color 0.3s ease, 
                box-shadow 0.3s ease, 
                transform 0.2s ease;

    box-shadow: 0 0 10px var(--thumb-shadow, rgba(127, 132, 150, 0.9)); 
}

.slider-container:hover .slider-thumb {
    transform: translate(-50%, -50%) scale(1.8);
    box-shadow: 0 0 8px var(--thumb-hover-shadow, rgba(73, 73, 73, 0.505));
}

.slider-thumb.dragging {
    transform: translate(-50%, -50%) scale(2.2);
    cursor: grabbing;
    box-shadow: 0 0 12px var(--thumb-dragging-shadow, rgba(82, 82, 82, 0.8));
}

.slider-thumb:hover {
    background-color: var(--thumb-hover-background, #62aeff);
}

.slider-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-direction: column;
    flex-shrink: 0;
}


.slider-output {
    font-size: smaller;
    font-weight: 100;

    color: var(--text-color);

    position: absolute; 
    left: -20px;

    white-space: nowrap;
    user-select: none;
    cursor: pointer;

    transform: translateY(-50%); 
    transition: color 0.3s ease;
    filter: blur(0px);

    pointer-events: auto;
}

.slider-snap-point {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    width: 12px;
    height: 1px;

    background-color: var(--track-line, #000000); 
    pointer-events: none; 

    transition: background-color 0.3s ease, 
                box-shadow 0.3s ease, 
                transform 0.3s ease, 
                filter 0.3s ease;

    box-shadow: 0 0 5px var(--thumb-shadow, rgba(255, 255, 255, 1)); 

}

.data-item {
    height: auto;
    break-inside: avoid;

    background-color: var(--block-background-color);
    border: 1px solid var(--block-border-color);
    box-shadow: 0 2px 8px rgba(99, 97, 97, 0.2);

    padding: 15px;
    border-radius: 8px;
    word-wrap: break-word;

    opacity: 1;
    transform: scale(1) translateY(0);
    transform-origin: center center;

    transition: transform 0.25s ease-out,
                box-shadow 0.3s ease-out,
                opacity 0.25s ease-out,
                background-color 0.3s ease,
                border-color 0.3s ease;

    will-change: transform, opacity, box-shadow;
    position: relative;
    z-index: 1;
}

.data-item.popping-in {
    animation: itemPopIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

@keyframes itemPopIn {
    0% { opacity: 0; transform: scale(0.5) translateY(40px); }
    65% { opacity: 1; transform: scale(1.04) translateY(2); }
    100% { opacity: 1; transform: scale(1) translateY(0); }
}

.data-item:hover {
    transform: scale(1.1) translateY(-4px); 
    box-shadow: 0 4px 20px rgba(95, 93, 93, 0.3);
    z-index: 10;
}

.data-item strong {
    display: block;
    margin-bottom: 5px;
    color: var(--text-color);
    opacity: 0.8;
}

.data-item > span {
    display: inline; 
}

.data-item span > span {
    display: inline-block;
    opacity: 0;
    transition: opacity 0.4s ease-out;
    transform: translateY(5px);
}


.data-item.fading-out {
    opacity: 0 !important;
    transform: translateY(10px) scale(0.95);
    pointer-events: none;
    z-index: 0;
}
.data-item.fading-in {
    opacity: 0;
    animation: itemFadeIn 0.3s ease-out forwards;
}

@keyframes itemFadeOut {
    from { opacity: 1; transform: translateY(0); }
    to { opacity: 0; transform: translateY(10px); }
}

@keyframes itemFadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
}

.data-container {
    position: relative;
    height: 300px;
    width: 300px; 
    margin-left: 20px; 
}

.year-container {
    position: relative;
    height: 300px;
    width: 60px;
}


.year-container-original {
    position: absolute;
    right: 100%;
    margin-right: 20px;
    top: 0; 
    height: 100%; 
    width: auto; 
    pointer-events: none;
}

.data-container-right {
    width: 500px; 
    height: auto;
    flex-grow: 1;
    position: relative;
}
