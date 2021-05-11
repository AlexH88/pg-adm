import * as React from 'react';
import {block} from 'bem-cn';
import {bind} from 'decko';
import './style.styl';

interface IProps {
	isLoaded: boolean;
}

const b = block('progressbar');

class ProgressBar extends React.PureComponent<IProps,{}> {

	private id: string;
	private isDone: boolean = false;

	componentDidMount() {
		if(this.props.isLoaded) {
			this.onLoaded();
		} else {
			this.launch(10);
		}
	}

	componentDidUpdate() {
		if(this.props.isLoaded) {
			this.onLoaded();
		}
	}

	componentWillMount() {
		this.id = "progressbar" + Math.random();
	}

	public render() {

		return (
			<div>
				<div className={b("container")}>
					<div className={b()}>
						<div id={this.id} onClick={this.onLoaded} className={b("contain")}></div>
					</div>
				</div>
			</div>
		)

	}

	private async launch(seconds: number) {
		const timeChunk = Number((seconds/7).toFixed(4));
		// await new Promise(res => setTimeout(res, 0));
		await this._run(0, 0);
		await this._run(timeChunk, 50);
		await this._run(timeChunk, 75);
		await this._run(timeChunk, 87.5);
		await this._run(timeChunk, 93.75);
		await this._run(timeChunk, 96.875);
		await this._run(timeChunk, 98.4375);
		await this._run(timeChunk, 100);
	}

	private async _run(seconds: number, width: number) {
		if(this.isDone) return;
		return new Promise(res => {
			this._setDuration(seconds);
			this._setWidth(width);
			setTimeout(() => {
				res();
			}, seconds*1000);
		});
	}

	private _setWidth(width: number) { // width in %
		const contain: any = document.getElementById(this.id);
		// const contain: any = this.refs.contain;
		try {
		contain.style.width = width + '%';
		} catch(e) {}
	}

	private _setDuration(seconds: number) {
		// const contain: any = this.refs.contain;
		const contain: any = document.getElementById(this.id);
		try {
			contain.style.transitionDuration = seconds + 's';
		} catch(e) {}
	}

	@bind
	private onLoaded() {
		this._setDuration(0.1);
		this._setWidth(100);
		this.isDone = true;
	}

}

export { ProgressBar };

