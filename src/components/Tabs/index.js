import React from 'react';
import PropTypes from 'prop-types';

function Tabs({ tab, setTab }) {

  return (
      <>

            <ul className="nav nav-tabs">
              <li className="nav-item" onClick={(e) => { e.preventDefault(); setTab("tab1")}}>
                <a className={`nav-link ${tab === 'tab1'? 'active': ''}`} href="/#">All</a>
              </li>
              <li className="nav-item" onClick={(e) => { e.preventDefault(); setTab("tab2")}}>
                <a className={`nav-link ${tab === 'tab2'? 'active': ''}`} href="/#" >Payment is late</a>
              </li>
              <li className="nav-item" onClick={(e) => { e.preventDefault(); setTab("tab3")}}>
                <a className={`nav-link ${tab === 'tab3'? 'active': ''}`} href="/#">Lease ends in less than a month</a>
              </li>
            </ul>

      </>
  );
}

export default Tabs;


Tabs.propTypes = {
  setTab: PropTypes.func,
  tab: PropTypes.string
};
