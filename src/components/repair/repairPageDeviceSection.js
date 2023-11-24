import React, { Component } from 'react'
import {Link} from 'react-router'

class RepairPageDeviceSection extends Component {
    constructor(props) {
        super(props)

        this.state = {
            dataDevices: []
        }

        this.loadDevices = this.loadDevices.bind(this)
        this.mapDevices = this.mapDevices.bind(this)
    }
    componentDidMount(){
        this.loadDevices()
    }
    loadDevices(){
        document.getElementById('spinner-box-load').style.display = 'block'
        axios.get('/api/getRepairGroups')
            .then( response => {
                document.getElementById('spinner-box-load').style.display = 'none'
                this.setState({ dataDevices: response.data.repairGroups })
            })
    }
    mapDevices(item){
        return(
            <Link to={`/reparieren/${item.name.toLowerCase().replace(/ /g, '-')}-${item.id}`}
                  className="item-device"
                  key={item.id}>
                <div className="image">
                    <img src={`/images/design/repair_device_category-${item.id}.png`} alt=""/>
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
                        <p className="title">Welches Gerät haben Sie?</p>
                        <div className="wrap-devices">
                            {this.state.dataDevices.map(this.mapDevices)}
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

export default RepairPageDeviceSection