import React from 'react';

function GameSelectionView(props) {
  return (
    <div className="row" style={{marginTop:'20px'}}>
      <div className="col-xs-12">
        <div className="panel panel-default center-block" style={{width:'350px'}}>
          <div className="panel-body">
            <div className="form-group">
              <label>Game Mode</label>
              <select className="form-control" value={props.gameType} onChange={props.onGameTypeChange}>
                <option value="1P">Single Player</option>
                <option value="2P">Multiplayer</option>
              </select>
            </div>
            <button className="btn btn-default" onClick={props.onNextClick}>Go!</button>
          </div>
        </div>
      </div>
    </div>
  );
}


export default GameSelectionView;