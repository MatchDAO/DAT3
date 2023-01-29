class show_model {
	constructor(option = {}) {
		console.log(option)
		this.bodyModel = null;
		this.cancelModel = null;
		this.confirmModel = null;
		this.pageHeight = uni.getSystemInfoSync().screenHeight;
		let opacity = option.opacity || 0.4;
		let zIndex = option.zIndex || 99;
		let model_tit = option.title || '温馨提示';
		let model_concent = option.concent || "内容~"
		let clickEvent = option.IsclickEvent || false;
		let cancelVal = option.cancelVal || '取消';
		let confirmVal = option.confirmVal || '确认';
		let cancelColor = option.cancelColor || '#666666';
		let confirmColor = option.confirmColor || '#007aff';
		let delCancel = option.delCancel || false;
		let align = option.align || "center"
		let fn = () => { }
		this.$event = option.$event || fn
		//#ifdef APP-PLUS
		console.log('creatView')
		this.creatView({ height: `${this.pageHeight}px`, top: 0 }, opacity, clickEvent, { 'tit': model_tit, 'concent': model_concent, cancelVal, confirmVal, confirmColor, cancelColor, delCancel, align })
		//#endif
	}

	//生成提示框view
	creatView(style, opa, clickEvent, modelInfo) {
		style = {
			left: '0px',
			width: '100%',
			...style
		}

		let view = new plus.nativeObj.View('showModalView', style);
		view.draw([
			{ tag: 'rect', id: 'modal', color: `rgba(0,0,0,${opa})`, position: { top: '0px', left: '0px', width: '100%', height: '100%' } },
			{ tag: 'rect', id: 'concent', color: `rgb(255,255,255)`, rectStyles: { borderWidth: '2px', radius: '8px' }, position: { top: '280px', left: '10%', width: '80%', height: '160px' } },
			{ tag: 'font', id: 'title', text: modelInfo.tit, textStyles: { size: '16px', color: '#000' }, position: { top: '290px', left: '20%', width: '60%', height: '30px' } },
			{ tag: 'font', id: 'text', text: modelInfo.concent, textStyles: { size: '14px', color: '#666', whiteSpace: 'normal', align: modelInfo.align }, position: { top: '320px', left: '23%', width: '54%', height: '60px' } },
			{ tag: 'rect', id: 'line', color: '#EAEAEC', position: { top: '390px', left: '10%', width: '80%', height: '1px' } },
			{ tag: 'rect', id: 'line2', color: '#EAEAEC', position: { top: '390px', left: '49%', width: modelInfo.delCancel ? '0px' : '1px', height: modelInfo.delCancel ? '0px' : '50px' } }

		]);

		if (!modelInfo.delCancel) {
			// 取消    
			let viewCancel = new plus.nativeObj.View('cancel', { width: '20%', height: '5%', top: '396px', left: '20%', backgroundColor: 'rgba(255,255,255,0)' });
			viewCancel.draw([
				{ tag: 'font', id: 'cancel', text: modelInfo.cancelVal, textStyles: { color: modelInfo.cancelColor, size: '16px' } },
			]);

			viewCancel.addEventListener("click", (e) => {
				this.$event({ res: false, types: 'cancel' });
				this.hide()
			}, false);
			this.cancelModel = viewCancel;
		}

		// 确认
		let viewconfirm = new plus.nativeObj.View('confirm', { width: modelInfo.delCancel ? '60%' : '40%', height: '5%', top: '396px', left: modelInfo.delCancel ? '20%' : '50%', backgroundColor: 'rgba(255,255,255,0)' });
		viewconfirm.draw([
			{ tag: 'font', id: 'confirm', text: modelInfo.confirmVal, textStyles: { color: modelInfo.confirmColor, size: '16px' } },
		]);

		viewconfirm.addEventListener("click", (e) => {
			this.$event({ res: true, types: 'confirm' });
			this.hide();
		}, false);
		//点击蒙布
		if (clickEvent) {

			view.addEventListener("click", (e) => {
				this.$event({ res: false, types: 'cover' });
				this.hide()
			}, false);
		}
		this.bodyModel = view;
		this.confirmModel = viewconfirm;
	}
	showModalAnimationClose() {
		var options = { type: 'pop-out', duration: 300 };
		plus.nativeObj.View.startAnimation(options, { bitmap: this.bodyModel }, { bitmap: this.cancelModel }, { bitmap: this.viewconfirm }, function () {
			console.log('plus.nativeObj.View.startAnimation动画结束');
			// 关闭原生动画
			plus.nativeObj.View.clearAnimation();
		});
	}
	showModalAnimationOpen() {
		var options = { type: 'pop-in', duration: 300 };
		plus.nativeObj.View.startAnimation(options, { bitmap: this.bodyModel }, { bitmap: this.cancelModel }, { bitmap: this.viewconfirm }, function () {
			console.log('plus.nativeObj.View.startAnimation动画结束');
			// 关闭原生动画
			plus.nativeObj.View.clearAnimation();
		});
	}
	show() {
		this.showModalAnimationOpen();
		this.bodyModel.show();
		if (this.cancelModel) {
			this.cancelModel.show();
		}
		this.confirmModel.show();

	}
	hide() {
		this.showModalAnimationClose();
		this.bodyModel.hide();
		if (this.cancelModel) {
			this.cancelModel.hide();
		}
		this.confirmModel.hide();


	}
}


export function showModal(opt) {
	console.log('showModal:innner')
	//#ifdef APP-PLUS
	console.log('showModal:app')
	new show_model({
		...opt,
		concent:opt.content,
		delCancel:!opt.showCancel,
		$event: opt.complete
		// function (e) {
		// 	if (e.res) {
		// 		opt.success && opt.success()
		// 	} else {
		// 		opt.fail && opt.fail()
		// 	}
		// 	opt.complete && opt.complete()
		// }
	}).show();
	//#endif
	//#ifdef H5
	uni.showModal({
		...opt
	})
	//#endif
}
