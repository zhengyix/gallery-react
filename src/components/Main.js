require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import ReactDOM from 'react-dom'

//获取图片相关的数据
var imageDatas = require('../data/imageDatas.json');
//let yeomanImage = require('../images/yeoman.png');

//将图片名信息转换成URL路径信息
//var
//
//获取区间内日的随机值
function getRangeRandom(low,high){
   return  Math.ceil(Math.random() * (high - low) + low);
}

//获取0到30度的任意正付值
function get30DegRandom(){
  return ((Math.random() > 0.5 ? '':'-')+ Math.ceil(Math.random() * 30));
}
//
var imageDatas = (function genImageURL(imageDatasArr){
	for(var i =0,j = imageDatasArr.length;i<j;i++){
		var singleImageData = imageDatasArr[i];
		singleImageData.imageURL = require('../images/'+singleImageData.fileName);
		imageDatasArr[i] = singleImageData;
	}
	return imageDatasArr;
})(imageDatas);

var  ImgFigure =React.createClass({
//imgFigure的点击函数
    handleClick:function(e){

        if(this.props.arrange.isCenter){
            this.props.inverse();
        }else{
            this.props.center();
        }

        e.stopPropagation();
        e.preventDefault();
    },
    render:function() {

        var styleObj ={};
        //如果props属性中指定了这张图片的位置，则使用
        if(this.props.arrange.pos){
            styleObj = this.props.arrange.pos;
        }

        //如果图片的旋转角度有值并且不为0，添加旋转角度
        if(this.props.arrange.rotate){
            (['MozTransform','msTransform','WebkitTransform','transform']).forEach(function(value){
                styleObj[value] = 'rotate('+this.props.arrange.rotate + 'deg)';
            }.bind(this));          
        }

        if(this.props.arrange.isCenter){
            styleObj.zIndex = 11;
        }

        var imgFigureClassName = 'img-figure';
            imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse': '';
        //console.log(this.props.arrange);
        return (
                <figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
                    <img src={this.props.data.imageURL}  alt={this.props.data.title}/>
                    <figcaption>
                        <h2 className="img-title">{this.props.data.title}</h2>
                        <div className="img-back" onClick={this.handleClick}>
                            <p>
                                {this.props.data.desc}
                            </p>
                        </div>
                    </figcaption>
                </figure>
            );
    }
})

//控制组件，
var ControllerUnit = React.createClass({
    handleClick:function(e){

        //如果点击的是当前的选中太按钮，则翻转图片，否则将对应的图片居中
        if(this.props.arrange.isCenter){
            this.props.inverse();
        }else{
            this.props.center();
        }
        e.stopPropagation();
        e.preventDefault();
    },
    render:function(){
        var controllerUnitClassName='controller-unit';

        //如果对应的是居中的图片，显示控制按钮的居中态
        if(this.props.arrange.isCenter){
            controllerUnitClassName += ' is-center';

            //如果同时对应的实现反转图片，显示控制台的翻转台
            if(this.props.arrange.isInverse){
                controllerUnitClassName += ' is-inverse';
            }
        }
        return (
                <span className={controllerUnitClassName} onClick={this.handleClick}></span>
            );
    }
})

var  AppComponent = React.createClass({
  Constant: {
    centerPos: {
        left: 0,
        right: 0
    },
    hPosRange:{//水平方向取值范围
        leftSecX:[0,0],
        rightSecX:[0,0],
        y:[0,0]
    },
    vPosRange:{//垂直方向取值范围
        x:[0,0],
        topY:[0,0]
    }
  },

/*
    翻转图片
    @param index 输入当前被执行的inverse 操作的图片对应的图片信息数组的index值
    @return {Function} 这是一个闭包函数，其内return一个真正待被执行的函数
 */
    inverse: function(index){
        return function(){
            var imgsArrangeArr = this.state.imgsArrangeArr;

            imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;
            this.setState({
                imgsArrangeArr:imgsArrangeArr
            });
        }.bind(this);
    },
  /*重新布局素有图片
    @param-centerIndex zhiding 
  */
  rearrange:function (centerIndex) {
        var imgsArrangeArr = this.state.imgsArrangeArr,
            Constant = this.Constant,
            centerPos = Constant.centerPos,
            hPosRange = Constant.hPosRange,
            vPosRange = Constant.vPosRange,
            hPosRangeLeftSecX = hPosRange.leftSecX,
            hPosRangeRightSecX = hPosRange.rightSecX,
            hPosRangeY = hPosRange.y,
            vPosRangeTopY = vPosRange.topY,
            vPosRangeX = vPosRange.x,

            imgsArrangeTopArr = [],
            topImgNum = Math.floor(Math.random() * 2),//去一个或不去
            topImgSpliceIndex= 0,

            imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex,1);
            //首先剧中centerIndex图片
            imgsArrangeCenterArr[0]={
                pos:centerPos,
                rotate:0,
                isCenter:true
            };

            //居中的centerIndex的图片不需要旋转
           // imgsArrangeCenterArr[0].rotate = 0;


            //取出布局上册图片的状态信息
            topImgSpliceIndex= Math.ceil(Math.random() *(imgsArrangeArr.length - topImgNum));
            imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex,topImgNum);

            //布局位于上侧的图片
            imgsArrangeTopArr.forEach(function(value,index){
                imgsArrangeTopArr[index]={
                    pos:{
                        top:getRangeRandom(vPosRangeTopY[0],vPosRangeTopY[1]),
                        left:getRangeRandom(vPosRangeX[0],vPosRangeX[1])
                    },
                    rotate: get30DegRandom(),
                    isCenter:false
                }
            });

            //布局左右两侧的图片
            for(var i =0,j = imgsArrangeArr.length, k = j /2; i< j; i++){
                var hPosRangeLORX = null;

                //前半部分布局在左边，右半部分布局在右边
                if(i < k){
                    hPosRangeLORX = hPosRangeLeftSecX;
                }else{
                    hPosRangeLORX = hPosRangeRightSecX;
                }

                imgsArrangeArr[i]={
                    pos:{
                            top:getRangeRandom(hPosRangeY[0],hPosRangeY[1]),
                            left:getRangeRandom(hPosRangeLORX[0],hPosRangeLORX[1])

                        },
                        rotate: get30DegRandom(),
                        isCenter:false
                };
            }

            if(imgsArrangeTopArr && imgsArrangeTopArr[0]){
                imgsArrangeArr.splice(topImgSpliceIndex,0,imgsArrangeTopArr[0]);
            }

            imgsArrangeArr.splice(centerIndex,0,imgsArrangeCenterArr[0]);

            this.setState({
                imgsArrangeArr:imgsArrangeArr
            })
  },

  /*
  利用rearrange函数，居中对应index的图片
  @param index,需要被居中的图片对应的图片信息数组的index
  @return [Function]
   */
  center:function(index){
    return function(){
        this.rearrange(index);
    }.bind(this);
  },
    getInitialState:function(){
        return {
            imgsArrangeArr:[
               /* {
                    pos:{
                        left:'0',
                        top:'0'
                    }，
                    rotate:0,//旋转角度
                    isInverse:false , //图片正反面
                    isCenter:false    //是否居中
                }*/
            ]
        }
  },
//组件加载以后，为每张图片计算其位置的范围
  componentDidMount:function () {
  
//拿到舞台大小
    var stageDOM = ReactDOM.findDOMNode(this.refs.stage),
        stageW = stageDOM.scrollWidth,
        stageH = stageDOM.scrollHeight,
        halfStageW = Math.ceil(stageW / 2),
        halfStageH = Math.ceil(stageH / 2);

        //拿到imgFigure的大小
        var imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
            imgW = imgFigureDOM.scrollWidth,
            imgH = imgFigureDOM.scrollHeight,
            halfImgW = Math.ceil(imgW / 2),
            halfImgH = Math.ceil(imgH /2);
        //计算中心图片的位置点
        this.Constant.centerPos = {
            left:halfStageW - halfImgW,
            top:halfStageH - halfImgH
        }

        //计算左侧，右侧区域图片排布位置的范围
        this.Constant.hPosRange.leftSecX[0] = -halfImgW;
        this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
        this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
        this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
        this.Constant.hPosRange.y[0] = -halfImgH;
        this.Constant.hPosRange.y[1] = stageH - halfImgH;

        //计算上册区域图片拍图位置的范围
        this.Constant.vPosRange.topY[0] = -halfImgH;
        this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
        this.Constant.vPosRange.x[0] = halfStageW - imgW;
        this.Constant.vPosRange.x[1] = halfStageW;

        this.rearrange(0);
  },
  
  render:function() {
    var controllerUnits = [],
        imgFigures = [];
    imageDatas.forEach(function(value,index){

        if(!this.state.imgsArrangeArr[index]){
            this.state.imgsArrangeArr[index] = {
                pos:{
                    left:0,
                    top:0
                },
                rotate:0,
                isInverse:false,
                isCenter:false
            }
        }
            //console.log(this.state.imgsArrangeArr[index]);
        imgFigures.push(<ImgFigure key={index} data={value} ref={'imgFigure'+index}
         arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)}/>);
        
        controllerUnits.push(<ControllerUnit key={index} arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} 
        center={this.center(index)}/>)
    }.bind(this))


    return (
     	<section className="stage" ref="stage">
     		<section className="img-sec">
                {imgFigures}
     		</section>
     		<nav className="controller-nav">
                {controllerUnits}
     		</nav>
     	</section>
    );
  }
})

AppComponent.defaultProps = {
};

export default AppComponent;
