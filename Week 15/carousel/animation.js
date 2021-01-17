import { linear } from "./timingFunction.js";

//使用Symbol防止外部访问变量
const TICK = Symbol("tick"); //每帧执行的动作
const TICK_HANDLER = Symbol("tick-handler"); //请求动画帧的句柄
const ANIMATIONS = Symbol("animations"); //动画
const START_TIME = Symbol("start-time"); //每个动画的开始时间
const PAUSE_START = Symbol("pause-start"); //暂停开始时间
const PAUSE_TIME = Symbol("pause-time"); //累计暂停的时间总和

class Timeline {
	constructor() {
		this.state = "inited";
		this[ANIMATIONS] = new Set();
		this[START_TIME] = new Map();
	}

	start () {
		if (this.state !== "inited") return;

		this.state = "started";
		let startTime = Date.now();
		this[PAUSE_TIME] = 0;

		this[TICK] = () => {
			let now = Date.now();

			for (const animation of this[ANIMATIONS]) {
				let t;

				if (this[START_TIME].get(animation) < startTime) {
					t = now - startTime - this[PAUSE_TIME] - animation.delay; //核心1
				} else {
					t = now - this[START_TIME].get(animation) - this[PAUSE_TIME] - animation.delay; //核心1
				}

				if (animation.duration < t) {
					this[ANIMATIONS].delete(animation);
					t = animation.duration;
				}

				if (t > 0) animation.receive(t); //核心1
			}

			this[TICK_HANDLER] = requestAnimationFrame(this[TICK]);
		};

		this[TICK]();
	}

	set rate (val) {
		this.rate = val;
	}

	get rate () {
		return this.rate;
	}

	pause () {
		if (this.state !== "started") return;

		this.state = "pause";
		this[PAUSE_START] = Date.now();

		cancelAnimationFrame(this[TICK_HANDLER]);
	}

	resume () {
		if (this.state !== "pause") return;

		this.state = "started";
		this[PAUSE_TIME] += Date.now() - this[PAUSE_START];

		this[TICK]();
	}

	reset () {
		this.pause();
		this.state = "inited";
		this[ANIMATIONS] = new Set();
		this[START_TIME] = new Map();
		this[PAUSE_START] = 0;
		this[PAUSE_TIME] = 0;
		this[TICK_HANDLER] = null;
	}

	add (animation, startTime) {
		if (arguments.length < 2) {
			startTime = Date.now();
		}

		this[ANIMATIONS].add(animation);
		this[START_TIME].set(animation, startTime);
	}
}

class Animation {
	constructor(object, property, startValue, endValue, duration, delay, timingFunction, template) {
		this.timingFunction = timingFunction || linear;
		this.template = template || ((v) => v);
		this.object = object;
		this.property = property;
		this.startValue = startValue;
		this.endValue = endValue;
		this.duration = duration;
		this.delay = delay;
	}
	receive (time) {
		let range = this.endValue - this.startValue;
		let progress = time / this.duration;
		let stepDiff = range * this.timingFunction(progress);
		this.object[this.property] = this.template(this.startValue + stepDiff);
	}
}

export { Timeline, Animation };
