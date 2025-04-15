document.addEventListener('DOMContentLoaded', function () {
    const sliderContainers = document.querySelectorAll('.slider-container');

    if (typeof censusData === 'undefined' || !censusData || !censusData.data) {
        console.error('Census data is missing or invalid.');
        return;
    }
    const data = censusData.data;
    if (!data || data.length === 0) {
        console.error('Census data array is empty.');
        return;
    }

    sliderContainers.forEach(sliderContainer => {
        const wrapper = document.createElement('div');
        wrapper.className = 'slider-data-wrapper';
        const controlsContainer = sliderContainer.closest('.controls');
        const mainContainer = controlsContainer ? controlsContainer.parentNode : sliderContainer.parentNode;

        if (controlsContainer) {
            mainContainer.insertBefore(wrapper, controlsContainer);
            wrapper.appendChild(sliderContainer);
        } else {
            mainContainer.insertBefore(wrapper, sliderContainer);
            wrapper.appendChild(sliderContainer);
        }

        const yearContainer = document.createElement('div');
        yearContainer.className = 'year-container-original';
        sliderContainer.appendChild(yearContainer);

        const dataContainer = document.createElement('div');
        dataContainer.className = 'data-container-right';
        wrapper.appendChild(dataContainer);

        const sliderTrack = sliderContainer.querySelector('.slider-track');
        const sliderThumb = sliderContainer.querySelector('.slider-thumb');
        const sliderIndicatorCircleLeft = sliderContainer.querySelector('.slider-indicator-circle-left');
        const sliderIndicatorCircleRight = sliderContainer.querySelector('.slider-indicator-circle-right');

        if (!sliderTrack || !sliderThumb || !sliderIndicatorCircleLeft || !sliderIndicatorCircleRight) {
            console.error('Required slider elements not found within a .slider-container.');
            return;
        }

        const output = document.createElement('div');
        output.className = 'slider-output';
        yearContainer.appendChild(output);

        const dataTextContainer = document.createElement('div');
        dataTextContainer.className = 'data-text';
        dataContainer.appendChild(dataTextContainer);

        let isDragging = false;
        let animationFrameId = null;
        let targetPosition;
        let currentPosition;
        let sliderHeight;
        let currentDataIndex = -1;
        let isUpdatingData = false;
        let dataUpdateQueue = null;
        let currentAnimatedYear = null;
        let yearAnimationId = null;
        let targetAnimatedYear = null;

        function initializeSlider() {
            sliderHeight = sliderContainer.offsetHeight || sliderTrack.offsetHeight || 300;
            if (sliderHeight === 300 && !sliderContainer.offsetHeight && !sliderTrack.offsetHeight) {
                console.warn("Using fallback slider height: 300px");
            }

            createSnapPoints();
            const initialIndex = data.length - 1;
            const initialData = data[initialIndex];

            currentPosition = (initialIndex / (data.length - 1)) * sliderHeight;
            targetPosition = currentPosition;
            sliderThumb.style.top = `${currentPosition}px`;

            currentAnimatedYear = parseInt(initialData.year, 10);
            if (output) {
                output.textContent = currentAnimatedYear;
                output.style.top = `${currentPosition}px`;
            }

            renderDataItems(initialData, initialIndex, false);
            updateCircleState();
        }

        function createSnapPoints() {
            const numSnapPoints = data.length;
            sliderTrack.querySelectorAll('.slider-snap-point').forEach(el => el.remove());

            for (let i = 0; i < numSnapPoints; i++) {
                const snapPoint = document.createElement('div');
                snapPoint.classList.add('slider-snap-point');
                snapPoint.style.top = `${(i / (numSnapPoints - 1)) * 100}%`;
                sliderTrack.appendChild(snapPoint);
            }
        }

        function updateCircleState() {
            if (!sliderHeight) return;
            const thumbPosition = parseFloat(sliderThumb.style.top || 0);
            const normalizedPosition = Math.max(0, Math.min(1, thumbPosition / sliderHeight));
            const threshold = 0.05;

            const leftActive = normalizedPosition < threshold;
            const rightActive = normalizedPosition > (1 - threshold);

            sliderIndicatorCircleLeft.classList.toggle('active', leftActive);
            sliderIndicatorCircleLeft.classList.toggle('inactive', !leftActive);
            sliderIndicatorCircleRight.classList.toggle('active', rightActive);
            sliderIndicatorCircleRight.classList.toggle('inactive', !rightActive);
        }

        function lerp(start, finish, time) {
            const LERP_FACTOR = 0.1;
            const progress = Math.min(1, Math.max(0, time));
            return start + (finish - start) * progress * LERP_FACTOR;
        }

        function animateThumb() {
            if (animationFrameId) cancelAnimationFrame(animationFrameId);

            function step() {
                if (Math.abs(currentPosition - targetPosition) > 0.5) {
                    currentPosition = lerp(currentPosition, targetPosition, 1);
                    sliderThumb.style.top = `${currentPosition}px`;
                    if (output) output.style.top = `${currentPosition}px`;
                    updateSliderOutput(false);
                    updateCircleState();
                    animationFrameId = requestAnimationFrame(step);
                } else {
                    currentPosition = targetPosition;
                    sliderThumb.style.top = `${targetPosition}px`;
                    if (output) output.style.top = `${targetPosition}px`;
                    animationFrameId = null;
                    snapToNearestPoint();
                }
            }
            animationFrameId = requestAnimationFrame(step);
        }

        function animateSnap() {
            if (animationFrameId) cancelAnimationFrame(animationFrameId);

            function step() {
                const distance = targetPosition - currentPosition;
                if (Math.abs(distance) > 0.2) {
                    currentPosition += distance * 0.25;
                    sliderThumb.style.top = `${currentPosition}px`;
                    if (output) output.style.top = `${currentPosition}px`;
                    updateSliderOutput(false);
                    updateCircleState();
                    animationFrameId = requestAnimationFrame(step);
                } else {
                    currentPosition = targetPosition;
                    sliderThumb.style.top = `${targetPosition}px`;
                    if (output) output.style.top = `${targetPosition}px`;
                    animationFrameId = null;
                    updateCircleState();
                }
            }
            animationFrameId = requestAnimationFrame(step);
        }

        function updateSliderOutput(shouldScheduleDataUpdate = true) {
            if (!sliderTrack || !sliderHeight || !output) return;

            const thumbPosition = parseFloat(sliderThumb.style.top || 0);
            output.style.top = `${thumbPosition}px`;

            const positionValue = Math.max(0, Math.min(100, (thumbPosition / sliderHeight) * 100));
            const dataIndex = Math.round((positionValue / 100) * (data.length - 1));
            const clampedIndex = Math.max(0, Math.min(dataIndex, data.length - 1));

            if (shouldScheduleDataUpdate && clampedIndex !== currentDataIndex) {
                dataUpdateQueue = { data: data[clampedIndex], index: clampedIndex };
                if (!isUpdatingData) {
                    processDataUpdateQueue();
                }
            }
        }

        function processDataUpdateQueue() {
            if (!dataUpdateQueue || isUpdatingData) {
                if (!dataUpdateQueue) isUpdatingData = false;
                return;
            }

            isUpdatingData = true;
            const { data: dataToShow, index: indexToShow } = dataUpdateQueue;
            dataUpdateQueue = null;

            if (indexToShow === currentDataIndex) {
                isUpdatingData = false;
                processDataUpdateQueue();
                return;
            }

            transitionDataItems(dataToShow, indexToShow);
        }

        function animateYearWithLerp(newTargetYear) {
            targetAnimatedYear = newTargetYear;

            if (yearAnimationId) {
                return;
            }
            if (currentAnimatedYear === null) {
                currentAnimatedYear = targetAnimatedYear;
                 if (output) output.textContent = Math.round(currentAnimatedYear);
                return;
            }

            const LERP_SMOOTHING_FACTOR = 1; 

            function yearLerpStep() {
                currentAnimatedYear = lerp(currentAnimatedYear, targetAnimatedYear, LERP_SMOOTHING_FACTOR);

                if (output) output.textContent = Math.round(currentAnimatedYear);

                if (Math.abs(currentAnimatedYear - targetAnimatedYear) > 0.1) {
                    yearAnimationId = requestAnimationFrame(yearLerpStep);
                } else {
                    currentAnimatedYear = targetAnimatedYear;
                    if (output) output.textContent = Math.round(currentAnimatedYear);
                    yearAnimationId = null;
                }
            }
            yearAnimationId = requestAnimationFrame(yearLerpStep);
        }

        async function transitionDataItems(newData, newIndex) {
            const oldItems = Array.from(dataTextContainer.querySelectorAll('.data-item:not(.fading-out)'));

            if (oldItems.length > 0) {
                const FADE_OUT_DURATION = 200;
                const TIMEOUT_BUFFER = 50;

                const fadeOutPromises = oldItems.map(item => {
                    return new Promise(resolve => {
                        item.classList.add('fading-out');
                        setTimeout(resolve, FADE_OUT_DURATION + TIMEOUT_BUFFER);

                        /*
                        item.addEventListener('transitionend', function handler(e) {
                            if (e.propertyName === 'opacity' && e.target === item) {
                                item.removeEventListener('transitionend', handler);
                                resolve();
                            }
                        }, { once: true });
                        */
                    });
                });
                
                await Promise.all(fadeOutPromises);
                dataTextContainer.querySelectorAll('.fading-out').forEach(el => el.remove());
            }

            renderDataItems(newData, newIndex, true);
            isUpdatingData = false;
            processDataUpdateQueue();
        }


        function renderDataItems(currentData, dataIndex, animate = true) {
            currentDataIndex = dataIndex;

            const dataPoints = [
                { key: 'Год', value: `${currentData.year} "${currentData.flag || ''}"`.trim() },
                { key: 'Территория', value: currentData.territory_km2 ? `${formatNumber(currentData.territory_km2)} км²` : '—' },
                { key: 'Население', value: currentData.total_population ? formatNumber(currentData.total_population) : '—' },
                { key: 'Плотность', value: currentData.density_km2 ? `${currentData.density_km2} чел./км²` : '—' },
                { key: 'Городское население', value: currentData.urban_population_share || '—' },
                { key: 'Мужчины/Женщины', value: getGenderRatio(currentData) },
                { key: 'Крупнейший город', value: formatCityName(currentData.largest_city) || '—' },
                { key: 'Второй город', value: formatCityName(currentData.second_largest_city) || '—' },
                { key: 'Русских', value: `${formatNumber(currentData.russian_population)}`  || '—' },
                { key: 'Доля русских', value: currentData.russian_population_share || '—' },
                { key: 'Нац. меньшинства', value: formatMinorities(currentData.national_minorities) || '—' }
            ];

            const fragment = document.createDocumentFragment();
            const BLOCK_ANIMATION_DELAY_STEP = 90; // ms

            dataPoints.forEach((point, index) => {
                const item = document.createElement('div');
                item.className = 'data-item';

                const strong = document.createElement('strong');
                strong.textContent = `${point.key}:`;
                item.appendChild(strong);

                const valueContainer = document.createElement('span');
                item.appendChild(valueContainer);

                const words = [];
                const valueHtml = point.value || '—';

                if (valueHtml.includes('<br>')) { 
                    valueContainer.innerHTML = ` ${valueHtml}`;
                } else if (valueHtml !== '—') {
                    valueContainer.appendChild(document.createTextNode(' ')); 
                    const textWords = valueHtml.split(/(\s+)/);

                    textWords.forEach(word => {
                        if (word.trim()) {
                            const wordSpan = document.createElement('span');

                            wordSpan.textContent = word;
                            wordSpan.style.opacity = '0';
                            wordSpan.style.transform = 'translateY(5px)';

                            valueContainer.appendChild(wordSpan);
                            words.push(wordSpan);
                        } else {
                            valueContainer.appendChild(document.createTextNode(word));
                        }
                    });
                } else {
                    valueContainer.textContent = ' —'; 
                }


                if (animate) {
                    item.style.opacity = '0';
                    item.style.transition = 'none'; 

                    fragment.appendChild(item); 

                    const blockDelay = index * BLOCK_ANIMATION_DELAY_STEP;
                    setTimeout(() => {
                        item.style.transition = ''; 
                        item.classList.add('popping-in'); 

                        item.addEventListener('animationend', function handler(e) {
                            if (e.animationName === 'itemPopIn' && e.target === item) {
                                item.removeEventListener('animationend', handler);
                                item.classList.remove('popping-in');
                                item.style.opacity = '1';

                                animateWordsForItem(words);
                            }
                        }, { once: true });

                    }, blockDelay);

                } else {
                    item.style.opacity = '1';
                    item.style.transform = 'none'; 

                    words.forEach(span => { 
                        span.style.opacity = '1';
                        span.style.transform = 'none';
                    });

                    fragment.appendChild(item);
                }
            });

            dataTextContainer.appendChild(fragment); 
        }


        function formatNumber(num) {
            if (num === null || num === undefined) return '—';
            const numStr = String(num);
            return numStr.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
        }

        function formatCityName(city) {
            if (!city) return '—';
            return city.replace('С.-Петербург', 'Санкт-Петербург').replace('ок.', '≈');
        }

        function formatMinorities(text) {
            return text ? text.replace(/\n/g, '<br>') : '—';
        }

        function getGenderRatio(data) {
            if (!data || data.male_population_share == null || data.female_population_share == null) return '—';
            return `${data.male_population_share} / ${data.female_population_share}`;
        }

        function animateWordsForItem(wordSpans) {
            if (!wordSpans || wordSpans.length === 0) return;

            let wordDelay = 0;
            const WORD_ANIMATION_DELAY_STEP = 40; // ms
            wordSpans.forEach(wordSpan => {
                setTimeout(() => {
                    wordSpan.style.opacity = '1';
                    wordSpan.style.transform = 'translateY(0)';
                }, wordDelay);
                wordDelay += WORD_ANIMATION_DELAY_STEP;
            });
        }


        function snapToNearestPoint() {
            if (!sliderHeight) return;
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
            animationFrameId = null;

            const thumbPosition = parseFloat(sliderThumb.style.top) || 0;
            const snapPoints = Array.from(sliderTrack.querySelectorAll('.slider-snap-point'));
            if (snapPoints.length === 0) return;

            let closestIndex = 0;
            let minDistance = Infinity;

            snapPoints.forEach((point, index) => {
                const pointPos = (index / (data.length - 1)) * sliderHeight;
                const distance = Math.abs(thumbPosition - pointPos);
                if (distance < minDistance) {
                    minDistance = distance;
                    closestIndex = index;
                }
            });

            targetPosition = (closestIndex / (data.length - 1)) * sliderHeight;
            targetPosition = Math.max(0, Math.min(targetPosition, sliderHeight));
            currentPosition = thumbPosition; 

            animateSnap(); 

            if (closestIndex >= 0 && closestIndex < data.length) {
                const targetYear = parseInt(data[closestIndex].year, 10);
                animateYearWithLerp(targetYear);

                if (closestIndex !== currentDataIndex) {
                    dataUpdateQueue = { 
                        data: data[closestIndex], 
                        index: closestIndex 
                    };

                    if (!isUpdatingData)
                        processDataUpdateQueue();
                }
            }
        }


        function onMouseMove(e) {
            if (!isDragging || !sliderHeight) 
                return;
            
            const trackRect = sliderTrack.getBoundingClientRect();
            const newY = Math.max(0, Math.min(e.clientY - trackRect.top, sliderHeight));

            currentPosition = newY; 

            sliderThumb.style.top = `${currentPosition}px`;
            if (output) 
                output.style.top = `${currentPosition}px`;


            updateSliderOutput(true); 
            updateCircleState();

            const positionRatio = currentPosition / sliderHeight;
            const estimatedIndex = positionRatio * (data.length - 1);
            const lowerIndex = Math.floor(estimatedIndex);
            const upperIndex = Math.ceil(estimatedIndex);

            if (lowerIndex >= 0 && upperIndex < data.length && lowerIndex !== upperIndex) {
                const lowerYear = parseInt(data[lowerIndex].year, 10);
                const upperYear = parseInt(data[upperIndex].year, 10);
                const lerpFactor = estimatedIndex - lowerIndex;
                const interpolatedYear = lowerYear + (upperYear - lowerYear) * lerpFactor;

                if (output) 
                    output.textContent = Math.round(interpolatedYear);

                currentAnimatedYear = interpolatedYear; 
            } else if (lowerIndex >= 0 && lowerIndex < data.length) {
                const targetYear = parseInt(data[lowerIndex].year, 10);

                if (output) 
                    output.textContent = targetYear;

                currentAnimatedYear = targetYear;
            }
        }

        function onMouseUp() {
            if (!isDragging) 
                return;

            isDragging = false;

            sliderThumb.classList.remove('dragging');
            document.removeEventListener('mousemove', onMouseMove);
            snapToNearestPoint(); 
        }

        sliderThumb.addEventListener('mousedown', (e) => {
            e.preventDefault(); 
            isDragging = true;
            sliderThumb.classList.add('dragging');
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp, { once: true }); 
            if (animationFrameId) 
                cancelAnimationFrame(animationFrameId); 

            animationFrameId = null;
            if (yearAnimationId) 
                cancelAnimationFrame(yearAnimationId); 

            yearAnimationId = null;
            dataUpdateQueue = null; 
        });


        sliderTrack.addEventListener('click', (e) => {

            if (e.target === sliderThumb || sliderThumb.contains(e.target)) 
                return;

            if (!sliderHeight) 
                return;

            const trackRect = sliderTrack.getBoundingClientRect();
            targetPosition = e.clientY - trackRect.top;
            targetPosition = Math.max(0, Math.min(targetPosition, sliderHeight)); 

            currentPosition = targetPosition; 
            sliderThumb.style.top = `${currentPosition}px`;
            if (output) output.style.top = `${currentPosition}px`;

            if (animationFrameId) 
                cancelAnimationFrame(animationFrameId);

            animationFrameId = null;

            if (yearAnimationId) 
                cancelAnimationFrame(yearAnimationId);

             yearAnimationId = null;
            dataUpdateQueue = null;

            updateCircleState(); 
            snapToNearestPoint();
        });

        output.addEventListener('click', (e) => {
            e.stopPropagation(); 
            if (!sliderHeight || isDragging) 
                return;

            const yearText = output.textContent;
            if (!yearText)
                return;

            const currentDisplayYear = Math.round(currentAnimatedYear); 
            const yearIndex = data.findIndex(item => item.year == currentDisplayYear);

            if (yearIndex >= 0 && yearIndex !== currentDataIndex) {
                targetPosition = (yearIndex / (data.length - 1)) * sliderHeight;
                targetPosition = Math.max(0, Math.min(targetPosition, sliderHeight));
                currentPosition = parseFloat(sliderThumb.style.top) || 0;

                if (animationFrameId) 
                    cancelAnimationFrame(animationFrameId);

                animationFrameId = null;

                if (yearAnimationId) 
                    cancelAnimationFrame(yearAnimationId);

                yearAnimationId = null;
                dataUpdateQueue = null;

                animateSnap(); 

                const targetYear = parseInt(data[yearIndex].year, 10);
                animateYearWithLerp(targetYear); 

                dataUpdateQueue = { 
                    data: data[yearIndex], 
                    index: yearIndex 
                };

                if (!isUpdatingData)
                    processDataUpdateQueue();
            }
        });

        requestAnimationFrame(() => { setTimeout(initializeSlider, 100); });

        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                const oldHeight = sliderHeight;
                sliderHeight = sliderContainer.offsetHeight || sliderTrack.offsetHeight || 300;

                if (sliderHeight !== oldHeight && currentDataIndex !== -1) {
                    currentPosition = (currentDataIndex / (data.length - 1)) * sliderHeight;
                    targetPosition = currentPosition; 

                    sliderThumb.style.top = `${currentPosition}px`;
                    if (output) output.style.top = `${currentPosition}px`;

                    createSnapPoints();
                    updateCircleState();
                }
            }, 250);
        });

    }); 
}); 
