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

    //WATCHING FOR STATE CHANGES
    @Watch('inputValue')
    onChangeStateValue(newValue: string, oldValue: string) {
        if (newValue !== oldValue) {
            console.log("STATE WATCHER WAS FIRED")
        }
    }

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
        if (newValue.trim().length > 0 && newValue !== this.inputValue) {
            this.inputValue = newValue;
            this.isInputValueValid = true;
            console.log("I was run")
        }       
    }

    componentWillLoad() {
        if(this.propValue) {
            console.log("COMPONENT WILL LOAD")
            this.inputValue = this.propValue;
            this.isInputValueValid = true
        }
    }

    render() {
        return (
            <div class="tdmcustom-search">
                <form class="tdmcustom-search__form">
                    <input 
                        class="tdmcustom-search__input" 
                        type="text"
                        value={this.inputValue}
                        onInput={this.handleInput}
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