import React, { Component } from 'react'

class DetailedInfoCondition extends Component {
    constructor(props) {
        super(props)

        this.state = {}
    }

    render() {
        let deviceType = '',
            text = null
        if(!this.props.criteriaId){
            deviceType = 'question-' + this.props.deviceType
            text = generalCondition
        }
        else{
            text = detailedCondition
            if(this.props.deviceType == 24) deviceType += this.props.deviceType
            else if(this.props.deviceType == 26) deviceType += this.props.brandType == 15 ? this.props.brandType : this.props.deviceType
            else if(this.props.deviceType == 23) {
                deviceType += (this.props.brandType == 3 || this.props.brandType == 2)
                    ? this.props.brandType
                    : '2'
            }
        }
         return (
            <div className="detail-info-condition light-box">
                <div className="light-box-container">
                    <div className="content">
                        <div className="">
                            <div className="top text-right">
                                <img src="/images/design/simple-close-logForm.svg"
                                     onClick={this.props.toggleInfoAboutCondition}
                                     alt=""/>
                            </div>
                            <div className="body">
                                <p className="title">{text.title}</p>
                                <p className="description">{text.titleDescription}</p>
                                <div className="row">
                                    <div className="col-md-4 item-condition">
                                        <div className="image">
                                            <img src={`/images/design/detail-condition-${deviceType}-1.png`} alt=""/>
                                        </div>
                                        <div>
                                            <p className="title">{text.itemConditionNew.title}</p>
                                            <p className="descr">{text.itemConditionNew.description}</p>
                                        </div>
                                    </div>
                                    <div className="col-md-4 item-condition">
                                        <div className="image">
                                            <img src={`/images/design/detail-condition-${deviceType}-2.png`} alt=""/>
                                        </div>
                                        <div>
                                            <p className="title">{text.itemConditionUsed.title}</p>
                                            <p className="descr">{text.itemConditionUsed.description}</p>
                                        </div>
                                    </div>
                                    <div className="col-md-4 item-condition">
                                        <div className="image">
                                            <img src={`/images/design/detail-condition-${deviceType}-3.png`} alt=""/>
                                        </div>
                                        <div>
                                            <p className="title">{text.itemConditionDefect.title}</p>
                                            <p className="descr">{text.itemConditionDefect.description}</p>
                                        </div>
                                    </div>
                                    <div className="cb"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default DetailedInfoCondition

const generalCondition = {
    title: 'Allgemeiner Zustand',
    titleDescription: 'Definieren Sie Ihren Zustand ob Ihr Gerät neu, gebraucht oder mangelhaft / defekt ist.',
    itemConditionNew: {
        title: 'Neu',
        description: 'Unter der Definition neu verstehen wir ein komplett neues Gerät, welches sich noch in einer verschweissten Originalverpackung befindet inkl. Garantieschein.'
    },
    itemConditionUsed: {
        title: 'Sichtbare Gebrauchsspuren',
        description: 'Unter der Definition gebraucht verstehen wir das Ihr Gerät benutzt wurde und Gebrauchsspuren enthalten kann, jedoch muss es voll funktionsfähig sein.'
    },
    itemConditionDefect: {
        title: 'Mangelhaft / Defekt',
        description: 'Unter der Definition mangelhaft / defekt verstehen wir Geräte welche einen Mangel (z.B. Glas gebrochen, Batterie schwach, Gerät lässt sich nicht einschalten usw.) aufweisen.'
    }
}
const detailedCondition = {
    title: 'Zustandsdefinitionen',
    titleDescription: 'Beschreiben Sie welchen äusserlichen Zustand Ihr Gerät hat.',
    itemConditionNew: {
        title: 'Keine Gebrauchsspuren',
        description: 'Beudeutet, dass keine Gebrauchsspuren sichtbar sind, ohne Kratzer, wie wenn es neu aus der Verpackung kommt.'
    },
    itemConditionUsed: {
        title: 'Leichte Gebrauchsspuren',
        description: 'Bedeutet, dass es leichte feine Kratzer enthalten kann, welche jedoch nicht spürbar sind.'
    },
    itemConditionDefect: {
        title: 'Spürbare Gebrauchsspuren',
        description: 'Beudetet, dass es stärkere Gebrauchsspuren wie Dellen, tiefe Kratzer, welche mit dem Finger spürbar sind enthalten kann. Hiermit sind jedoch keine Brüche oder Risse gemeint, diese müssen in der Kategorie mangelhaft / defekt deklariert werden.'
    }
}