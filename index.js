      // JavaScript Document
      var sectionURL = ['/indications/stroke-prevention-in-non-valvular-atrial-fibrillation',
        '/indications/treatment-of-pedvt-and-prevention-of-recurrent-vte',
        '/indications/prevention-of-atherothrombotic-events-in-symptomatic-pad',
        '/indications/prevention-of-atherothrombotic-events-in-chronic-cad',
        '/indications'];

      var sectionLabel = ['Wheel NVAF',
        'Wheel PE/DVT',
        'Wheel PAD',
        'Wheel CAD',
        'Wheel Other Indications'];
      var userIntercation = '';
      var rgbColor = '';
      var hs = '';
      var paths = '';
      var i = 0;
      var wheel = {
        _autoReel: 0,
        _autoReelSpeed: 0,
        _autoReelPosition: 0,
        _autoReelTimeOut: null,
        _hotspotIDs: ['upperSpot', 'rightSpot', 'leftSpot_1', 'leftSpot_2', 'centerSpot'],
        _svg: null,
        _navigationCallBack: null,
        _popOverCallBack: null,
        _selectedIndex: null,
        _userInteraction: true,
        // INTERNAL DOM STUFF
        _upperOuter: null,
        _upperInner: null,
        _rightOuter: null,
        _rightInner: null,
        _leftOuter: null,
        _leftInner_pad: null,
        _leftInner_cad: null,
        // END

        initWith: function initWith(wheelDomElement, autoReel, autoReelSpeed, selectedIndex,
                                    navigationCallBack, popOverCallBack) {
          wheel._svg = $(("#" + wheelDomElement));
          wheel._selectedIndex = selectedIndex;
          if (!wheel._svg) {
            console.error('Unable to find DOM Object cotains SVG, please check your HTML');
            return;
          }
          // SET TIME OUT FOR AUTO SHOW REEL
          wheel._autoReel = autoReel;
          wheel._autoReelSpeed = autoReelSpeed;
          // SET NAVIGATION CALL BACK
          wheel._navigationCallBack = navigationCallBack;
          // SET POP OVER CALL BACK
          wheel._popOverCallBack = popOverCallBack;
          // PRELOAD SVG VIUA OBJECT TAG TO ACCESS INTERNAL DOM
          
          
          wheel._svg.load('image/svg+xml', function () {
            wheel._svg = this.contentDocument;
            wheel.init();
          });


          document.getElementById('svg_wheel').addEventListener('load', function () {
            wheel._svg = this.contentDocument; // this.contentDocument;
            wheel.init();
          }, true);
        },
        init: function init() {
          wheel._upperOuter = wheel._svg.getElementById('upperOuterArch');
          if (wheel._upperOuter == null) { return; }
          wheel._upperInner = wheel._svg.getElementById('upperInnerArch');
          wheel._rightOuter = wheel._svg.getElementById('rightOuterArch');
          wheel._rightInner = wheel._svg.getElementById('rightInnerArch');
          wheel._leftOuter = wheel._svg.getElementById('leftOuterArch');
          wheel._leftInner_pad = wheel._svg.getElementById('Pad');
          wheel._leftInner_cad = wheel._svg.getElementById('Cad');
          for (i = 0; i < wheel._hotspotIDs.length; i++) {
            hs = wheel._svg.getElementById(wheel._hotspotIDs[i]);
            if (wheel._selectedIndex === i) {
              wheel.onMouseOver(null);
            }
            else {
              if (hs == null) {
                console.error(("Unabel to find expected DOM elements in the SVG " + (wheel._hotspotIDs[i]) + " is missing!"));
              }
              hs.addEventListener('mouseover', wheel.onMouseOver);
              hs.addEventListener('mouseout', wheel.onMouseOut);
              if (wheel._navigationCallBack) { hs.addEventListener('mousedown', wheel.onMouseDown); }
            }
          }
          wheel.setShowAutoReel();
        },
        onMouseOver: function onMouseOver(e) {
          if (wheel._autoReelTimeOut) {
            clearTimeout(wheel._autoReelTimeOut);
            wheel.selectItemAtIndex(wheel.getPreviousSelectedItemIndex(), false);
            wheel._autoReelPosition = 0;
          }
          if (e === null && wheel._selectedIndex !== null) {
            wheel.selectItemAtIndex(wheel._selectedIndex, true);
          }
          else {
            if (!wheel._userInteraction) { return; }
            var selectedIndex = wheel._hotspotIDs.indexOf(e.currentTarget.id);
            if (selectedIndex > -1) {
              wheel.selectItemAtIndex(selectedIndex, true);
              if (wheel._popOverCallBack === null) { return; }
              wheel._popOverCallBack(selectedIndex, true);
            }
          }
        },
        onMouseOut: function onMouseOut(e) {
          if (!wheel._userInteraction) { return; }
          var selectedIndex = wheel._hotspotIDs.indexOf(e.currentTarget.id);
          if (selectedIndex > -1) {
            wheel.selectItemAtIndex(selectedIndex, false);
            wheel._popOverCallBack(selectedIndex, false);
          }
          wheel.setShowAutoReel();
        },
        onMouseDown: function onMouseDown(e) {
          if (!wheel._userInteraction) { return; }
          var selectedIndex = wheel._hotspotIDs.indexOf(e.currentTarget.id);
          if (selectedIndex > -1) {
            wheel._navigationCallBack(selectedIndex);
          }
        },
        userInteraction: function userInteraction(userInteraction$1) {
          wheel._userInteraction = userIntercation;
        },
        setShowAutoReel: function setShowAutoReel() {
          if (wheel._autoReel == null || wheel._selectedIndex != null) { return; }
          if (wheel._autoReelTimeOut) {
            clearTimeout(wheel._autoReelTimeOut);
          }
          wheel._autoReelTimeOut = setTimeout(wheel.doShowReel, wheel._autoReel * 1000);
        },
        doShowReel: function doShowReel() {
          wheel.selectItemAtIndex(wheel.getPreviousSelectedItemIndex(), false);
          wheel.selectItemAtIndex(wheel._autoReelPosition, true);
          wheel._autoReelPosition++;
          if (wheel._autoReelPosition === (wheel._hotspotIDs.length - 1)) {
            wheel._autoReelPosition = 0;
          }
          wheel._autoReelTimeOut = setTimeout(wheel.doShowReel, wheel._autoReelSpeed * 1000);
        },
        selectItemAtIndex: function selectItemAtIndex(index, selected) {
          switch (index) {
            case 0: // (First Btn) Default color and unselected color
              TweenMax.killTweensOf(wheel._upperOuter);
              TweenMax.killTweensOf(wheel._upperInner);
              if (selected) {
                TweenMax.to(wheel._upperOuter, 1, { fill: 'rgb(177,0,118)' });
                TweenMax.to(wheel._upperInner, 0.8, { fill: 'rgb(216,25,141)' });
              }
              else {
                TweenMax.to(wheel._upperOuter, 1, { fill: 'rgb(70,41,119)' });
                TweenMax.to(wheel._upperInner, 0.8, { fill: 'rgb(80,62,133)' });
              }
              break;
            case 1: // (Second Btn) Default color and unselected color
              TweenMax.killTweensOf(wheel._rightOuter);
              TweenMax.killTweensOf(wheel._rightInner);
              if (selected) {
                TweenMax.to(wheel._rightOuter, 1, { fill: 'rgb(177,0,118)' });
                TweenMax.to(wheel._rightInner, 0.8, { fill: 'rgb(216,25,141)' });
              }
              else {
                TweenMax.to(wheel._rightOuter, 1, { fill: 'rgb(117,116,175)' });
                TweenMax.to(wheel._rightInner, 0.8, { fill: 'rgb(148,144,197)' });
              }
              break;
            case 2: // (Third Btn) Default color and unselected color
              TweenMax.killTweensOf(wheel._leftOuter);
              TweenMax.killTweensOf(wheel._leftInner_pad);
              if (selected) {
                TweenMax.to(wheel._leftOuter, 1, { fill: 'rgb(75,171,80)' });
                TweenMax.to(wheel._leftInner_pad, 1, { fill: 'rgb(100,185,115)' });
              }
              else {
                TweenMax.to(wheel._leftOuter, 1, { fill: 'rgb(87,71,147)' });
                TweenMax.to(wheel._leftInner_pad, 1, { fill: 'rgb(102,92,160)' });
              }
              break;
            case 3:
              TweenMax.killTweensOf(wheel._leftOuter);
              TweenMax.killTweensOf(wheel._leftInner_cad);
              if (selected) {
                TweenMax.to(wheel._leftOuter, 1, { fill: 'rgb(75,171,80)' });
                TweenMax.to(wheel._leftInner_cad, 1, { fill: 'rgb(100,185,115)' });
              }
              else {
                TweenMax.to(wheel._leftOuter, 1, { fill: 'rgb(87,71,147)' });
                TweenMax.to(wheel._leftInner_cad, 1, { fill: 'rgb(102,92,160)' });
              }
              break;
            case 4:
              paths = wheel._svg.querySelectorAll('.st11');
              for (i = 0; i < paths.length; ++i) {
                TweenMax.killTweensOf(paths[i]);
                if (selected) {
                  TweenMax.to(paths[i], 1, { fill: 'rgb(177,0,118)' });
                }
                else {
                  TweenMax.to(paths[i], 1, { fill: 'rgb(148,144,197)' });
                }
              }
              break;
            default:
          }
          if (wheel._popOverCallBack !== null) { wheel._popOverCallBack(index, selected); }
        },
        getPreviousSelectedItemIndex: function getPreviousSelectedItemIndex() {
          var prevItem = wheel._autoReelPosition - 1;
          if (prevItem < 0) { prevItem = 3; }
          return prevItem;
        },
      };

      function whellInit() {
        wheel.initWith('svg_wheel',
          1, // Auto reel time out in sec. -> null disable this features
          4, // Auto Reel speed
          null, // Index of the item that should be selected by default -
          // this property override the auto show reel
          function (index) { // Call back for navigation index is zero based
            var gtmLabel = sectionLabel[index];
            if (gtmLabel !== '') {
            }
            document.location.href = sectionURL[index];
          },
          function (index, status) { // Call back for popover index is zero based
            if (index > 4 && status) { return; }
            if (status) {
              $(("#tooltip" + index)).fadeIn('slow');

            }
            else {
              $(("#tooltip" + index)).fadeOut('slow');
            }
          });
      }

      $( window ).on( "load", function() { 
        if ($('#svg_wheel').length) {
          whellInit();
        }
      });
