import Rect from "react";

function Awards(){
    return(
        <div className="container mt-5">
            <div className="row">
                <div className="col-lg-6 col-sm-12 p-5">
                    <img src="media/largestBroker.svg" />
                </div>

                <div className="col-lg-6 col-sm-12 p-5 mt-3">
                    <h1>Largest stock broker in India</h1>
                    <p  className="mb-5">2+ million Zerodha client contribute to over 15% of all retail order volumes in India daily by trading and investing in:</p>
                    <div className="row">
                        <div className="col-6">
                            <ul>
                            <li><p>Future and Options</p></li>
                            <li><p>Stocks & IPOs</p></li>
                            <li><p>Commodity derivatives</p></li>
                            </ul>
                        </div>

                        <div className="col-6">
                            <ul>
                            <li><p>Direct mutual funds</p></li>
                            <li><p>Currency derivatives</p></li>
                            <li><p>Bonds and Gov</p></li>
                            </ul>
                        </div>
                    </div>
                    <img src="media/pressLogos.png" className="mt-3" style={{width:"90%"}}/>
                </div>
            </div>
        </div>
    );
}

export default Awards;