import React, { Component } from 'react'
import PropTypes from 'prop-types'

class JobsComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {}


    }
    componentDidMount(){
        this._showHideBlocks()
    }
    _showHideBlocks(){
        $('.jobs-page p.title').on('click', function () {
            if($(this).parent().find('.content').css('display') === 'none'){
                $('.jobs-page .content').each( function () {
                    $(this).hide('slow')
                    $(this).parent().removeClass('active')
                    $(this).parent().find('i.fa').removeClass('fa-angle-up').addClass('fa-angle-down')
                })
                $(this).parent().find('.content').toggle('slow')
                $(this).parent().addClass('active')
                $(this).find('i.fa').removeClass('fa-angle-down').addClass('fa-angle-up')
            }
        })
    }

    render() {
        return (
            <div className="jobs-page">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <h2>Jobs in Basel</h2>
                            <ul>
                                <li>
                                    <p className="title">
                                        <span className="arrow"><i className="fa fa-angle-down" aria-hidden="true"/></span>
                                        Techniker (100%)
                                    </p>
                                    <div className="content">

                                    </div>
                                </li>
                                <li>
                                    <p className="title">
                                        <span className="arrow"><i className="fa fa-angle-down" aria-hidden="true"/></span>
                                        Verkäufer / Berater (100%)
                                    </p>
                                    <div className="content">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <p className="description-short">Sie bringen Erfahrung im Detailhandel mit und suchen eine neue Herausforderung? Dann sind Sie bei uns genau an der richtigen Stelle.</p>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="address">
                                                    <p className="green title">Ansprechpartner:</p>
                                                    <p>happyphone.ch GmbH</p>
                                                    <p>z.H. Patric Glanzmann</p>
                                                    <p>Gerbergasse 82</p>
                                                    <p>4001 Basel</p>
                                                    <p className="green"><a href="mailto:jobs@remarket.ch">jobs@remarket.ch</a></p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="description">
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="item-block">
                                                        <h5>Anforderungen:</h5>
                                                        <ul>
                                                            <li>Sie sind 20 - 30 Jahre jung, motiviert und teamfähig</li>
                                                            <li>Sie sind eine ehrliche, ehrgeizige und kommunikative Person</li>
                                                            <li>Sie haben ein gepflegtes Erscheinungsbild und sind selbstsicher</li>
                                                            <li>Sie haben langjährige Erfahrung mit Smartphones (Apple / Samsung etc.) und Tablets</li>
                                                            <li>Sie haben Interesse am Elektronik und IT-Bereich</li>
                                                            <li>Sie können auch in hektischen Situationen stets die Ruhe bewahren und den Überblick behalten</li>
                                                            <li>Sehr gute Deutsch-Kenntnisse vorausgesetzt (mündlich sowie schriftlich)</li>
                                                            <li>Gute Englisch-, Französisch- und gute Italienisch-Kenntnisse von Vorteil</li>
                                                            <li>Abgeschlossene Berufslehre, von Vorteil im Detailhandel</li>
                                                        </ul>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="item-block">
                                                        <h5>Tätigkeiten:</h5>
                                                        <ul>
                                                            <li>Bei dieser vielseitigen 100% Festanstellung sind Sie nach einer intensiven Schulung verantwortlich für Reparaturarbeiten von Smartphones und Tablets.</li>
                                                            <li>Annahme / Durchführung der Reparaturen von Smartphones und Tablets</li>
                                                            <li>Kundenbetreuung und Mithilfe im Verkauf</li>
                                                        </ul>
                                                    </div>
                                                    <div className="item-block">
                                                        <h5>remarket.ch bietet Ihnen:</h5>
                                                        <ul>
                                                            <li>Attraktive Anstellungsbedingungen</li>
                                                            <li>Einen modernen, zukunftssicheren und anforderungsreichen Arbeitsplatz</li>
                                                            <li>Einen abwechslungsreichen und tollen Arbeitstag</li>
                                                            <li>Ein gut eingespieltes und motiviertes Team</li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="address mobile">
                                                    <p className="green title">Ansprechpartner:</p>
                                                    <p>happyphone.ch GmbH</p>
                                                    <p>z.H. Patric Glanzmann</p>
                                                    <p>Gerbergasse 82</p>
                                                    <p>4001 Basel</p>
                                                    <p className="green"><a href="mailto:jobs@remarket.ch">jobs@remarket.ch</a></p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                                <li>
                                    <p className="title">
                                        <span className="arrow"><i className="fa fa-angle-down" aria-hidden="true"/></span>
                                        Praktikum (Verkauf) (100%)
                                    </p>
                                    <div className="content">

                                    </div>
                                </li>
                            </ul>

                            <h2>Jobs in Luzern</h2>


                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
JobsComponent.propTypes = {}
JobsComponent.defaultProps = {}
export default JobsComponent