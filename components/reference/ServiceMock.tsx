export function ServiceMock({ index }: { index: number }) {
  switch (index) {
    case 0:
      return (
        <div className="mk">
          <h5>{"Registration checklist"}</h5>
          <div className="ri">
            <i className="cx on"></i>
            {"Structure chosen"}
            <em>{"Done"}</em>
          </div>
          <div className="ri">
            <i className="cx on"></i>
            {"Documents prepared"}
            <em>{"Done"}</em>
          </div>
          <div className="ri">
            <i className="cx"></i>
            {"Application filed"}
            <em>{"Next"}</em>
          </div>
          <div className="ri">
            <i className="cx"></i>
            {"PAN guidance"}
            <em>{"Next"}</em>
          </div>
        </div>
      );
    case 1:
      return (
        <div className="mk">
          <h5>{"Monthly snapshot"}</h5>
          <div className="bars">
            <span>
              <i className="bs" style={{ height: "48%" }}></i>
              <i className="bc" style={{ height: "34%" }}></i>
            </span>
            <span>
              <i className="bs" style={{ height: "58%" }}></i>
              <i className="bc" style={{ height: "40%" }}></i>
            </span>
            <span>
              <i className="bs" style={{ height: "52%" }}></i>
              <i className="bc" style={{ height: "44%" }}></i>
            </span>
            <span>
              <i className="bs" style={{ height: "70%" }}></i>
              <i className="bc" style={{ height: "46%" }}></i>
            </span>
            <span>
              <i className="bs" style={{ height: "64%" }}></i>
              <i className="bc" style={{ height: "42%" }}></i>
            </span>
            <span>
              <i className="bs" style={{ height: "84%" }}></i>
              <i className="bc" style={{ height: "50%" }}></i>
            </span>
          </div>
          <div className="lg">
            <span>
              <i></i>
              {"Sales"}
            </span>
            <span>
              <i></i>
              {"Costs"}
            </span>
          </div>
        </div>
      );
    case 2:
      return (
        <div className="mk">
          <h5>{"Filing type"}</h5>
          <div className="sel">
            {"Choose what you need"}
            <i></i>
          </div>
          <div className="dd">
            <div className="di">
              <span>{"VAT returns"}</span>
              <em>{"Monthly"}</em>
            </div>
            <div className="di">
              <span>{"Income tax filing"}</span>
              <em>{"Annual"}</em>
            </div>
            <div className="di">
              <span>{"Annual company filing"}</span>
              <em>{"Yearly"}</em>
            </div>
          </div>
        </div>
      );
    case 3:
      return (
        <div className="mk">
          <h5>{"Auditor request list"}</h5>
          <div className="pr">
            <span>
              {"Financial statements"}
              <em>{"Ready"}</em>
            </span>
            <div className="pgb">
              <i style={{ width: "100%" }}></i>
            </div>
          </div>
          <div className="pr">
            <span>
              {"Supporting schedules"}
              <em>{"In progress"}</em>
            </span>
            <div className="pgb">
              <i style={{ width: "70%" }}></i>
            </div>
          </div>
          <div className="pr">
            <span>
              {"Reconciliations"}
              <em>{"In progress"}</em>
            </span>
            <div className="pgb">
              <i style={{ width: "45%" }}></i>
            </div>
          </div>
        </div>
      );
    case 4:
      return (
        <div className="mk">
          <h5>{"Financial reports"}</h5>
          <div className="tabs">
            <span>{"Profit & loss"}</span>
            <span>{"Balance sheet"}</span>
            <span>{"Cash flow"}</span>
          </div>
          <svg className="spk" viewBox="0 0 280 100">
            <defs>
              <linearGradient id="g5s" x1="0" x2="1">
                <stop offset="0" stopColor="#0a95dc"></stop>
                <stop offset="1" stopColor="#9a7cf0"></stop>
              </linearGradient>
              <linearGradient id="g5as" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#9a7cf0" stopOpacity=".28"></stop>
                <stop offset="1" stopColor="#9a7cf0" stopOpacity="0"></stop>
              </linearGradient>
            </defs>
            <path
              className="ar"
              d="M2 78 C30 70 52 74 84 54 S134 58 164 38 S226 34 278 12 V100 H2Z"
              fill="url(#g5as)"
            ></path>
            <path
              className="lp"
              pathLength="1"
              style={{ strokeDasharray: "1" }}
              d="M2 78 C30 70 52 74 84 54 S134 58 164 38 S226 34 278 12"
              fill="none"
              stroke="url(#g5s)"
              strokeWidth="3.5"
              strokeLinecap="round"
            ></path>
          </svg>
          <div className="lg">
            <span>
              <i></i>
              {"Sales"}
            </span>
            <span>
              <i></i>
              {"Costs"}
            </span>
            <span>
              <i></i>
              {"Margin"}
            </span>
          </div>
        </div>
      );
    case 5:
      return (
        <div className="mk">
          <h5>{"Closure steps"}</h5>
          <div className="tn on">{"Accounts reconciled"}</div>
          <div className="tn on">{"Tax matters cleared"}</div>
          <div className="tn cur">{"Final filings submitted"}</div>
          <div className="tn">{"Formal closure"}</div>
        </div>
      );
    default:
      return null;
  }
}
