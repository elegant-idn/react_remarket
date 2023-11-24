import React, { Component } from 'react'
import {Link} from 'react-router'

class RepairPageModelSection extends Component {
    constructor(props) {
        super(props)

        this.state = {
            dataModels: []
        }

        this.getModels = this.getModels.bind(this)
        this.mapModels = this.mapModels.bind(this)
    }
    componentDidMount(){
        this.getModels()
    }
    componentWillReceiveProps(nextProps){

        if(nextProps.params.device !== this.props.params.device){
            this.getModels(nextProps.params.device)
        }
    }
    getModels( deviceParam = this.props.params.device){
        let device = deviceParam.slice(0, deviceParam.lastIndexOf('-')).replace(/-/g, ' ')
        document.getElementById('spinner-box-load').style.display = 'block'
        axios.get(`/api/getRepairModels?repairGroup=${device}`)
            .then( response => {
                document.getElementById('spinner-box-load').style.display = 'none'
                this.setState({ dataModels: response.data.repairModels})
                window.scrollTo(0, document.querySelector('.select-device').offsetTop - 110)
            })
    }
    mapModels(item){
        let deviceName = this.props.params.device
        return(
            <Link to={`/reparieren/${deviceName}/${item.name.toLowerCase().replace(/ /g, '-')}-${item.id}`}
                  className="item-device"
                  key={item.id}>
                <div className="image">
                    <img src={item.image} alt=""/>
                </div>
                <p className="title">{item.name}</p>
            </Link>
        )
    }
    render() {
        return (
            <section className="select-device">
                <div className="container">
                    <div className="row">
                        <p className="category">Auswahl</p>
                        <p className="title">Welches Modell haben Sie?</p>
                        <p className="nav">Reparieren >> {this.props.params.device.replace(/-/g, ' ')} >> <span>Modell auswählen</span></p>
                        <div className="wrap-devices nav-menu">
                            {this.state.dataModels.map(this.mapModels)}
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6 col-md-push-3">
                            <div className="other-model">
                                <p>Anderes Modell?</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        )
    }
}

export default RepairPageModelSection