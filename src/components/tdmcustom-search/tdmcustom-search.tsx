import { Component, State, Prop, Watch } from '@stencil/core'
import { h } from '@stencil/core'

@Component({
    tag: 'tdmcustom-search', 
    styleUrl: './tdmcustom-search.css',
    shadow: true
})
export class TdmCustomSearch {   

    @State() inputValue: string = '';  
    @State() isInputValueValid: boolean = false;
    @State() error: boolean = false;
    @State() isLoading: boolean = true;
    @State() popupCheckbox: boolean = false;
    @State() searchResults: {name: string, country: string, image: {medium: string}, birthday: string, string, url: string}[] = [];

    //WATCHING FOR STATE CHANGES
    @Watch('inputValue')
    onChangeStateValue(newValue: string, oldValue: string) {
        if (newValue !== oldValue) {
           

        }
    }

    @Prop() searchFor: string;
    @Prop() propValue: string;

    @Watch('propValue')  
    onChangePropValue(newValue: string, oldValue: string) {
        console.log("WATCHER FOR PROP FIRED")
        if( newValue !== oldValue ) {
            this.inputValue = newValue
        }
    }

    handleInput(e: Event) {
        const newValue = (e.target as HTMLInputElement).value
        if (newValue.trim().length > 0) {
            this.inputValue = newValue;
            this.isInputValueValid = true;
            console.log("I was run")
            console.log(this.inputValue)
        }       
    }

    handleSubmit = (e: Event) => {
        e.preventDefault() 
        this.fetchData(this.inputValue)
    }

    handleCheckbox = (value: boolean) => {
        this.popupCheckbox = value
        console.log(this.popupCheckbox)
    }

    componentWillLoad() {
        if(this.propValue) {
            console.log("COMPONENT WILL LOAD")
            this.inputValue = this.propValue;
            this.isInputValueValid = true
        }
    }

    fetchData = async (selectedValue) => {
        this.searchResults = []
        this.popupCheckbox = true
        this.error = false 
        this.isLoading = true
        const value = selectedValue.toLowerCase() 
        const url = `https://api.tvmaze.com/search/people?q=${value}`
        console.log(url)
        try {
            const response = await fetch(url)
            const responseData = await response.json()
            if(!response.ok) {
                const newError = new Error('There was a problem while fetching the data')
                throw newError
            }
            const personsArray = responseData .filter(person => person.person.birthday && person.person.country.name && person.person.image && person.person.url)
                        .map(person => ({name: person.person.name, country: person.person.country.name, birthday: person.person.birthday, image: person.person.image, url: person.person.url  }))
            console.log(personsArray)
            setTimeout(() => {
                this.isLoading = false
                this.searchResults = personsArray
            }, 1000)
        } catch(err) {
            this.error = true
            console.log(err)
        }
    }

    renderLoader = () => {
        return (
            <div class="spinner-div"><div class="lds-ripple"><div></div><div></div></div></div>
        )
    }

    renderError = () => {
        return (
            <div class="error-message"><span class="error-text">There was an error. Try again later.</span></div>
        )
    }

    renderNoResults = () => {
        return (
            <div class="error-message"><span class="error-text">No results for your search.</span></div>
        )
    }

    renderResults = () => {
        return (
            <div class="results">
                <ul class="results__list">
                    {this.searchResults.map(person => (
                        <li class="person">
                            <div class="person__img_container">
                                <img class="person__img" src={person.image.medium} />
                            </div>
                            <div class="person__content">
                                <h4 class="person__name">{person.name}</h4>
                                <p class="person__bday">Birthday: <b>{person.birthday}</b></p>
                                <p class="person__country">Country: <b>{person.country}</b></p>
                                <a href={person.url} class="person__button">View info</a>
                            </div>
                        </li>
                    ))}
                </ul>     
            </div>
        )
    }

    renderStatus = () => {
        if(this.error) {
            return this.renderError()
        } else if (this.isLoading) {
            return this.renderLoader()
        } else if (!this.searchResults.length) {
            console.log("the function got here")
            return this.renderNoResults()
        } 
    }

    render() {
        return (
            <div class="tdmcustom-search">
                <h1 class="tdmcustom-search__title">Find info about {this.searchFor}</h1>
                <form class="tdmcustom-search__form" onSubmit={this.handleSubmit}>
                    <input 
                        class="tdmcustom-search__input" 
                        type="text"
                        value={this.inputValue}
                        onInput={(e) => this.handleInput(e)}
                    />
                    <button 
                        class="tdmcustom-search__button"
                        disabled={!this.isInputValueValid}>
                            Find Info
                    </button>
                </form>
                <div class={this.popupCheckbox ? 'overlay active' : 'overlay'} >
                    <div class="popup">
                        <span class="popup__close" onClick={() => this.handleCheckbox(false)}>&times;</span>
                        <h2 class="popup__title">Your search results</h2>
                        {this.renderStatus()} 
                        {this.searchResults.length > 0 && this.renderResults()}    
                    </div>
                </div>
            </div>
        )
    }
}