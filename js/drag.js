function Drag(id){
			var _this = this;
			this.disX = 0;
			this.disY = 0;
			this.l = 0;
			this.t = 0;
			
			this.oDiv = document.getElementById(id);

			this.oDiv.onmousedown = function(ev){
				_this.fnDown(ev);
			};
		}

		Drag.prototype.fnDown = function (ev){
				var _this = this;
				var oEvent = ev || event;

				this.disX = oEvent.clientX - this.oDiv.offsetLeft; 
				this.disY = oEvent.clientY - this.oDiv.offsetTop;

				document.onmousemove = function(ev){
					_this.fnMove(ev);
				};

				document.onmouseup = function(ev){
					_this.fnUp(ev);
				};
		};

		Drag.prototype.fnMove = function (ev){
				var oEvent = ev || event;

				this.l = oEvent.clientX - this.disX ;
				this.t = oEvent.clientY - this.disY ;

					if(this.l<0){
						this.l = 0;
					}else if(this.l>document.documentElement.clientWidth-this.oDiv.offsetWidth){
						this.l = document.documentElement.clientWidth-this.oDiv.offsetWidth;
					}
					if(this.t<0){
						this.t = 0;
					}else if(this.t>document.documentElement.clientHeight-this.oDiv.offsetHeight){
						this.t = document.documentElement.clientHeight-this.oDiv.offsetHeight;
					}

					this.oDiv.style.left = this.l+ 'px';
					this.oDiv.style.top= this.t + 'px';
		};

		Drag.prototype.fnUp = function(){
			document.onmousemove = null;
			document.onmouseup = null;
		};