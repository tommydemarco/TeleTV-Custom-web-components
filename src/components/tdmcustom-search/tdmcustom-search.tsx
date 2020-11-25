import { Component, State, Prop, Watch } from '@stencil/core'
import { h } from '@stencil/core'

@Component({
    tag: 'tdmcustom-search', 
    styleUrl: './tdmcustom-search.scss',
    scoped: true
})
export class TdmCustomSearch {   

    @State() inputValue: string = '';  
    @State() isInputValueValid: boolean = false;
    @State() error: boolean = false;
    @State() isLoading: boolean = false;

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

    componentWillLoad() {
        if(this.propValue) {
            console.log("COMPONENT WILL LOAD")
            this.inputValue = this.propValue;
            this.isInputValueValid = true
        }
    }

    fetchData = async (selectedValue) => {
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
            console.log(responseData)
            this.isLoading = false
        } catch(err) {
            this.error = true
            console.log(err)
        }
    }

    render() {
        return (
            <div class="tdmcustom-search">
                <h1>Select the name of {this.searchFor}</h1>
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
            </div>


        )
    }
}