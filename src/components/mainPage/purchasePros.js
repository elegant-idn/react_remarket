import React from 'react'

const PurchasePros = () => {
    const styleImg = {
        width: '100px',
        height: '30px',
    };
    return (
        <div>

            <section id="purchase-pros">
                <h2>Wir machen verkaufen einfach</h2>
                <p>Uns so funktioniert es:</p>

                <article>
                    <span className="icon-1"></span>
                    <img src="/images/purchase-pros-01.png" alt="" />
                    <h3>1. Angebot erhalten</h3>
                    <p>Bewerte dein Gerät und erhalte einen fairen Preis</p>
                </article>

                <div className="arrow fl">
                    <img src="/images/arrow-right.svg" style={styleImg} alt="" />&nbsp;
                </div>

                <article>
                    <span className="icon-2"></span>
                    <img src="/images/purchase-pros-02.png" alt="" />
                    <h3>2. Sende es an ReMarket</h3>
                    <p>Sende dein Gerät kostenlos zu uns</p>
                </article>


                <div className="arrow fl">
                    <img src="/images/arrow-right.svg" alt="" style={styleImg} />&nbsp;
                </div>

                <article>
                    <span className="icon-3"></span>
                    <img src="/images/purchase-pros-03.png" alt="" />
                    <h3>3. Zahlung erhalten</h3>
                    <p>Sie erhalten die Zahlung <strong>EXPRESS</strong> überwiesen.</p>
                </article>
            </section>

            <div className="cb"></div>
        </div>
    )
}
export default PurchasePros;