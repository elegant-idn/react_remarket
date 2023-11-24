import React, {Component} from 'react'
import PropTypes from 'prop-types'

class SendLinkMobile extends Component {
    constructor(props) {
        super(props)

        this.state = {}

        this.changeCheckbox = this.changeCheckbox.bind(this)
        this.copyToClipboard = this.copyToClipboard.bind(this)
    }

    changeCheckbox(e){
        if(e.target.checked){
            $('.wrapOverlay').css({display: 'block'})
            $('.sellPage #myModalResult.modal').css({overflow: 'visible'})
            $('.sellPage .buttonsForMobile').css({opacity: 0.73})
            $('.wrapLinks').css({display: 'flex'})
        }
        else{
            $('.wrapOverlay').css({display: 'none'})
            $('.sellPage #myModalResult.modal').css({overflow: 'scroll'})
            $('.sellPage .buttonsForMobile').css({opacity: 1})
            $('.wrapLinks').hide()
        }
    }
    copyToClipboard(e){
        e.preventDefault()
        Clipboard.copy(document.querySelector('.hiddenInputWithLink').value)
        $('#linkBtn').click()
    }

    render() {
        let link = window.location.href,
            message = `Hallo,\nhier der Link von remarket um dein Gerät zu verkaufen\n${link}`,
            linkWhatsApp = `whatsapp://send?text=Hallo,\nhier der Link von remarket um dein Gerät zu verkaufen\n${link}`
        return (
            <div>
                <div className="wrapOverlay"/>
                <div className="sendLinkMobile">
                    <input type="checkbox" id="linkBtn" onChange={this.changeCheckbox}/>
                    <label htmlFor="linkBtn"/>
                    <div className="wrapLinks">
                        <span className="title">Link teilen</span>
                        <div className="itemBtn">
                            <a href={"mailto:?body=" + encodeURI(message)} onClick={() => $('#linkBtn').click()}>
                                <img src="/images/design/mail-links.png" alt=""/>
                            </a>
                        </div>
                        <div className="itemBtn">
                            <a href={encodeURI(linkWhatsApp)} onClick={() => $('#linkBtn').click()}>
                                <img src="/images/design/whatsapp-links.png" alt=""/>
                            </a>
                        </div>
                        <div className="itemBtn">
                            <a href="" onClick={this.copyToClipboard}>
                                <img src="/images/design/copy-to-clipboard.png" alt=""/>
                            </a>
                            <textarea
                                className="hiddenInputWithLink"
                                defaultValue={link}/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

SendLinkMobile.propTypes = {}
SendLinkMobile.defaultProps = {}

export default SendLinkMobile

window.Clipboard = (function(window, document, navigator) {
    var textArea,
        copy;

    function isOS() {
        return navigator.userAgent.match(/ipad|iphone/i);
    }

    function createTextArea(text) {
        textArea = document.createElement('textArea');
        textArea.value = text;
        document.body.appendChild(textArea);
    }

    function selectText() {
        var range,
            selection;

        if (isOS()) {
            range = document.createRange();
            range.selectNodeContents(textArea);
            selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
            textArea.setSelectionRange(0, 999999);
        } else {
            textArea.select();
        }
    }

    function copyToClipboard() {
        document.execCommand('copy');
        document.body.removeChild(textArea);
    }

    copy = function(text) {
        createTextArea(text);
        selectText();
        copyToClipboard();
    };

    return {
        copy: copy
    };
})(window, document, navigator);