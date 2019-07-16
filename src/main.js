import api from "./api";

class App {
    constructor() {
        this.repositories = []

        this.formEl = document.getElementById('repo-form')
        this.listEl = document.getElementById('repo-list')
        this.inputEl = document.querySelector('input[name=repository]')

        this.registerHandles()
    }

    registerHandles() {
        this.formEl.onsubmit = event => this.addRepository(event)
    }

    setLoading(loading = true) {
        if (loading === true) {
            let loadingEl = document.createElement('span')
            loadingEl.appendChild(document.createTextNode('Carregando...'))
            loadingEl.setAttribute('id', 'loading')

            this.formEl.appendChild(loadingEl)
        } else {
            document.getElementById('loading').remove()
        }
    }

    async addRepository(event) {
        event.preventDefault()

        const valueInput = this.inputEl.value

        if (valueInput.length === 0)
            return

        this.setLoading()

        try {
            const response = await api.get(`/repos/${valueInput}`)
            const {
                name,
                description,
                owner: {
                    html_url
                }
            } = response.data

            this.repositories.push({
                name,
                description,
                html_url,
            })

            this.inputEl.value = ''
            this.render()
        } catch (err) {
            alert('Esse repositório não foi encontrado')
        }

        this.setLoading(false)

    }
    render() {
        this.listEl.innerHTML = ''

        this.repositories.forEach((repository) => {
            let imgEl = document.createElement('img')
            imgEl.setAttribute('src', repository.avatar_url)

            let strongEl = document.createElement('strong')
            strongEl.appendChild(document.createTextNode(repository.name))

            let pEl = document.createElement('p')
            pEl.appendChild(document.createTextNode(repository.description))

            let linkEl = document.createElement('a')
            linkEl.setAttribute('href', repository.html_url)
            linkEl.setAttribute('target', '_blank')
            linkEl.appendChild(document.createTextNode('acessar'))

            let listItemEl = document.createElement('li')
            listItemEl.appendChild(imgEl)
            listItemEl.appendChild(strongEl)
            listItemEl.appendChild(pEl)
            listItemEl.appendChild(linkEl)

            this.listEl.appendChild(listItemEl)
        })
        console.log(this.repositories)
    }
}

new App()