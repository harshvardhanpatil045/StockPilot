import React from "react";

function Footer() {
  return ( 
    <footer style={{backgroundColor:"rgb(250,250,250"}}>
    <div className="container border-top mt-5">
      <div className="row mt-5" >
        <div className="col-3">
          <img src="media/logo4.png" style={{ width: "50%" }} />
          <p>
            &copy; 2010 - 2024, Not StockPliot Broking Ltd.<br></br>All right
            reserved.
          </p>
          <div className="">
            <i class="fa-brands fa-twitter"></i>
            <i class="fa-brands fa-facebook"></i>
            <i class="fa-brands fa-instagram"></i>
            <i class="fa-brands fa-linkedin"></i>
            <i class="fa-brands fa-telegram"></i>
          </div>
        </div>
        <div className="col-3 text-muted link_color">
          <p style={{color:"black"}}>Company</p>
          <a href="" style={{ textDecoration: "none" }} className="link_color">
            About
          </a>
          <br></br>
          <a href="" style={{ textDecoration: "none" }} className="link_color">
            Products
          </a>
          <br></br>
          <a href="" style={{ textDecoration: "none" }} className="link_color">
            Pricing
          </a>
          <br></br>
          <a href="" style={{ textDecoration: "none" }}className="link_color">
            Referral programme
          </a>
          <br></br>
          <a href="" style={{ textDecoration: "none" }}className="link_color">
            Careers
          </a>
          <br></br>
          <a href="" style={{ textDecoration: "none" }} className="link_color">
            StockPliot.tech
          </a>
          <br></br>
          <a href="" style={{ textDecoration: "none" }} className="link_color">
            Press & media
          </a>
          <br></br>
          <a href="" style={{ textDecoration: "none" }} className="link_color">
            StockPliot cares
          </a>
          <br></br>
        </div>
        <div className="col-3 text-muted">
          <p style={{color:"black"}}>Suport</p>
          <a href="" style={{ textDecoration: "none" }}className="link_color">
            Contact
          </a>
          <br></br>
          <a href="" style={{ textDecoration: "none" }} className="link_color">
            Support portal
          </a>
          <br></br>
          <a href="" style={{ textDecoration: "none" }} className="link_color">
            Z-Connect blog
          </a>
          <br></br>
          <a href="" style={{ textDecoration: "none" }} className="link_color">
            List of charges
          </a>
          <br></br>
          <a href="" style={{ textDecoration: "none" }} className="link_color">
            Downloads & resources
          </a>
          <br></br>
        </div>
        <div className="col-3 text-muted ">
          <p style={{color:"black"}}>Account</p>
          <a href="" style={{ textDecoration: "none" }} className="link_color">
            Open an account
          </a>
          <br></br>
          <a href="" style={{ textDecoration: "none" }} className="link_color">
            Fund transfer
          </a>
          <br></br>
          <a href="" style={{ textDecoration: "none" }} className="link_color">
            60 day challenge
          </a>
          <br></br>
        </div>
      </div>

      <div className="mt-5  text-small text-muted" style={{fontSize:"14px"}}>
      <p>
        {" "}
        StockPliot Broking Limited: Member of NSE, BSE, MCX & MSEI – SEBI
        Registration no.: INZ000031633 CDSL/NSDL: Depository services through
        StockPliot Broking Limited – SEBI Registration no.: IN-DP-431-2019, CIN:
        U65929KA2018PLC116815, Registered Address: #153/154, 4th Cross, Dollars
        Colony, Opp. Clarence Public School, J.P Nagar 4th Phase, Bengaluru -
        560078, Karnataka, India. For any complaints pertaining to securities
        broking please write to complaints@StockPliot.com, for DP related to
        dp@StockPliot.com. Please ensure you carefully read the Risk Disclosure
        Document as prescribed by SEBI | ICF
      </p>
      <p>
        Procedure to file a complaint on SEBI SCORES/SMARTODR: Register on
        SCORES portal & SMARTODR. Mandatory details for filing complaints on
        SCORES: Name, PAN, Address, Mobile Number, E-mail ID. Benefits:
        Effective Communication, Speedy redressal of grievances
      </p>
      <p>
        Investments in securities market are subject to market risks; read all
        the related documents carefully before investing.
      </p>
      <p>
        "Prevent unauthorised transactions in your account. Update your mobile
        numbers/email IDs with your stock brokers/depository participants.
        Receive information of your transactions directly from
        Exchange/Depositories on your mobile/email at the end of the day. Issued
        in the interest of investors. KYC is one time exercise while dealing in
        securities markets - once KYC is done through a SEBI registered
        intermediary (broker, DP, Mutual Fund etc.), you need not undergo the
        same process again when you approach another intermediary." Dear
        Investor, if you are subscribing to an IPO, there is no need to issue a
        cheque. Please write the Bank account number and sign the IPO
        application form to authorize your bank to make payment in case of
        allotment. In case of non allotment the funds will remain in your bank
        account. As a business we don't give stock tips, and have not authorized
        anyone to trade on behalf of others. If you find anyone claiming to be
        part of StockPliot and offering such services, please create a ticket here.
      </p>
      </div>
    </div>
    </footer>
  );
}

export default Footer;
