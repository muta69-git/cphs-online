async function removeMessages(main_container) {
    let child = main_container.lastElementChild; 
    
    while (child) {
        main_container.removeChild(child);
        child = main_container.lastElementChild;
    }
}

export {removeMessages};