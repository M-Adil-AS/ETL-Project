let name = document.querySelector('.planetName')
let neighborStars = document.querySelector('.neighborStars')
let neighborPlanets = document.querySelector('.neighborPlanets')
let method = document.querySelector('.method')
let facility = document.querySelector('.facility')
let discoveryYear = document.querySelector('.discoveryYear')
let allInputElements = [name, neighborPlanets, neighborStars, discoveryYear, method, facility]

let exoplanets = []
let searchExoplanets = []

fetch('/exoplanets')
.then(async response => {
    const reader = response.body.getReader();
    const textDecoder = new TextDecoder();
    let partialChunk = '';

    while(true) {
        const { done, value } = await reader.read();
        if(done){
            if(exoplanets.length % 100 != 0){
                document.querySelector('ul').insertAdjacentHTML('beforeend', `<li class="page-item"><button class="page-link">${Math.ceil(exoplanets.length/100)}</button></li>`)
            }

            allInputElements.forEach(elem => elem.disabled = false)
            
            let methodOptions = ''
            const uniqueMethods = [...new Set(exoplanets.map(exoplanet => exoplanet.discovery.method))]
            methodOptions += uniqueMethods.map(method => `<option>${method}</option>`)
            method.insertAdjacentHTML('beforeend', methodOptions)

            let facilityOptions = ''
            const uniqueFacilities = [...new Set(exoplanets.map(exoplanet => exoplanet.discovery.facility))]
            facilityOptions += uniqueFacilities.map(facility => `<option>${facility}</option>`)
            facility.insertAdjacentHTML('beforeend', facilityOptions)

            searchExoplanets = JSON.parse(JSON.stringify(exoplanets))
            
            break
        }

        const chunk = partialChunk + textDecoder.decode(value);
        const lines = chunk.split('\n'); 

        const completeLines = lines.slice(0, -1); // Exclude the last partial line

        for (const line of completeLines) {
            try {
                const exoplanet = JSON.parse(line);
                exoplanets.push(exoplanet)

                if(exoplanets.length>=200 && exoplanets.length%100==0){
                    document.querySelector('ul').insertAdjacentHTML('beforeend', `<li class="page-item"><button class="page-link">${exoplanets.length/100}</button></li>`)
                }

                if(exoplanets.length<=100){
                    document.querySelector('tbody').insertAdjacentHTML('beforeend', `
                        <tr>
                            <td scope="col">${exoplanets.length}</td>
                            <td scope="col">${exoplanet.name}</td>
                            <td scope="col">${exoplanet.neighbors.stars}</td>
                            <td scope="col">${exoplanet.neighbors.planets}</td>
                            <td scope="col">${exoplanet.discovery.method}</td>
                            <td scope="col">${exoplanet.discovery.year}</td>
                            <td scope="col">${exoplanet.discovery.facility}</td>
                            <td scope="col">${exoplanet.orbital_period.value}</td>
                            <td scope="col">${exoplanet.orbital_period.error}</td>
                            <td scope="col">${exoplanet.radius.value}</td>
                            <td scope="col">${exoplanet.radius.error}</td>
                        </tr>`
                    )
                }
            } 
            catch (error) {
                console.error("Error parsing JSON:", error);
            }
        }

        partialChunk = lines[lines.length - 1]; // Store the last partial line
    }
})
.catch(error => {
    console.error("Fetch error:", error);
});

document.addEventListener('click', (e)=>{
    if(e.target.classList.contains('page-link')){
        document.querySelectorAll('.page-item').forEach(elem => elem.classList.remove('active'))
        e.target.parentElement.classList.add('active')
        let pageNo = Number(e.target.innerHTML);
        (name.disabled) ? displayPageItems(pageNo, exoplanets) : displayPageItems(pageNo, searchExoplanets)
    }
})

allInputElements.forEach(inputElem => {
    inputElem.addEventListener('change', (e)=> {
        searchExoplanets = JSON.parse(JSON.stringify(exoplanets))

        if(name.value != ''){
            searchExoplanets = searchExoplanets.filter(elem => elem.name.toLowerCase().includes(name.value.toLowerCase()))
        }
        if(neighborStars.value != ''){
            searchExoplanets = searchExoplanets.filter(elem => elem.neighbors.stars==neighborStars.value)
        }
        if(neighborPlanets.value != ''){
            searchExoplanets = searchExoplanets.filter(elem => elem.neighbors.planets==neighborPlanets.value)
        }
        if(method.value != 'All Methods'){
            searchExoplanets = searchExoplanets.filter(elem => elem.discovery.method==method.value)
        }
        if(facility.value != 'All Facilities'){
            searchExoplanets = searchExoplanets.filter(elem => elem.discovery.facility==facility.value)
        }
        if(discoveryYear.value != ''){
            searchExoplanets = searchExoplanets.filter(elem => elem.discovery.year==discoveryYear.value)
        }

        document.querySelectorAll('.page-item').forEach(elem => elem.remove())

        if(searchExoplanets.length){
            for(let i=1; i<=Math.ceil(searchExoplanets.length/100); i++){
                document.querySelector('ul').insertAdjacentHTML('beforeend', `<li class="page-item"><button class="page-link">${i}</button></li>`)
            }
    
            Array.from(document.querySelectorAll('.page-item'))[0].classList.add('active')
            let pageNo = 1
            displayPageItems(pageNo, searchExoplanets)
        }
        else{
            Array.from(document.querySelector('tbody').children).forEach((elem) => elem.remove())
        }
    })
})

function displayPageItems(pageNo, array){
    Array.from(document.querySelector('tbody').children).forEach((elem) => elem.remove())

    let start = (pageNo-1)*100
    let end = start + 99
    let html = ''

    for(let i=start; i<=end; i++){
        if(array[i]){
            html += `
            <tr>
                <td scope="col">${i + 1}</td>
                <td scope="col">${array[i].name}</td>
                <td scope="col">${array[i].neighbors.stars}</td>
                <td scope="col">${array[i].neighbors.planets}</td>
                <td scope="col">${array[i].discovery.method}</td>
                <td scope="col">${array[i].discovery.year}</td>
                <td scope="col">${array[i].discovery.facility}</td>
                <td scope="col">${array[i].orbital_period.value}</td>
                <td scope="col">${array[i].orbital_period.error}</td>
                <td scope="col">${array[i].radius.value}</td>
                <td scope="col">${array[i].radius.error}</td>
            </tr>`  
        }
    }

    document.querySelector('tbody').insertAdjacentHTML('beforeend', html)
}