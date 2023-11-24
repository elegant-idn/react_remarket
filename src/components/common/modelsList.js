import React, {Component} from 'react'
import { Link } from 'react-router'
import api from '../../api/index'

class ModelsList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modelsList: []
        };
    }
    componentWillReceiveProps(nextProps){
        if( nextProps.params.device && nextProps.params.device !== this.props.params.device ){
            let deviceName  = nextProps.params.device
            deviceName = deviceName.split("-").join(' ')
            document.getElementById('spinner-box-load').style.display = 'block'
            let body = {deviceName: deviceName}
            api.getModels( `/api/models`,  body)
                .then( ({ data }) => {
                    document.getElementById('spinner-box-load').style.display = 'none'
                    this.setState({ modelsList: data.meta.namesList})
                })

        }
    }
    componentDidMount(){
        let deviceName  = this.props.params.device
        deviceName = deviceName.split("-").join(' ')
        document.getElementById('spinner-box-load').style.display = 'block'
        let body = {deviceName: deviceName}
        api.getModels( `/api/models`,  body)
            .then( ({ data }) => {
                document.getElementById('spinner-box-load').style.display = 'none'
                this.setState({ modelsList: data.meta.namesList})
            })
    }
    mapModelsList = ( model, i ) => {
        let nameForUrl = model.split(" ").join('-');
        return(
            <Link to={{
                pathname: `${this.props.location.pathname}/Models=${nameForUrl}`,
            }}
                  title={`${model.model} verkaufen`}
                  className="row"
                  key={i}>
                <span className="image"><img src={ model.image || '/images/model/iphone.png' }/></span>
                <span className="title">{ model }</span>
            </Link>
        )
    };

    render() {
        return (
            <div>
                <h2>Modell auswählen</h2>
                <div className="model" id="modelList">
                    {this.state.modelsList.length > 0 && <Link to={{pathname: `${this.props.location.pathname}/Models=${this.state.modelsList.map( item => item.split(' ').join('-')).join(',')}`,}}
                                                              title='Alle anzeigen'
                                                              className="row">
                                                            <span className="image"><img src='/images/model/iphone.png'/></span>
                                                            <span className="title">Alle anzeigen</span>
                                                         </Link>
                    }
                    {this.state.modelsList.map(this.mapModelsList)}
                    <div className="cb"/>
                </div>
                <div className="line"/>
            </div>
        );
    }
}

export default ModelsList