import React from 'react';

function Universe(){
    return(
        <div className='container mt-5'>
            <div className='row text-center'>
                <h1>The Stockpilot universe</h1>
                <p>Extend your trading and investment experience even further with our partner platforms</p>
 
                
                <div className='col-4 p-3 mt-5'>
                    <img src="media/smallcaseLogo.png"/>
                    <p className='text-small text-muted'>Thematic investment platform</p>
                </div>
                <div className='col-4 p-3 mt-5'>
                    <img style={{width:"39%"}} src="media/streakLogo.png"/>
                    <p className='text-small text-muted'>Algo & strategy platform</p>
                </div>
                <div className='col-4 p-3 mt-5'>
                    <img style={{width:"50%"}}src="media\sensibullLogo.svg"/>
                    <p className="text-small text-muted mt-2">Options trading platform</p>
                </div>
                <div className='col-4 p-3 '>
                    <img style={{width:"50%"}}src="media\zerodhaFundhouse.png"/>
                    <p className='text-small text-muted'>Asset management</p>
                </div>
                <div className='col-4 p-3' mt-5>
                    <img style={{width:"50%"}}src="media\goldenpiLogo.png"/>
                    <p className='text-small text-muted'>Bonds trading platform</p>
                </div>
                <div className='col-4 p-3' mt-5>
                    <img style={{width:"37%"}} src="media\dittoLogo.png"/>
                    <p className="text-small text-muted">Insurance</p>
                </div>
                <button className="p-2 btn btn-primary fs-5" style={{width:"25%", margin:"0 auto"}}>Signup now</button>
            </div>
        </div>
    );
}

export default Universe;
