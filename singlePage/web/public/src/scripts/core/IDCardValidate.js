(function($) {
	$(function() {
	
		var ACCEPT = ""; // 检查通过是返回的的成功标识字符串

		var EIGHTEEN_IDCARD = 18; // 标识18位身份证号码
		var FIFTEEN_IDCARD = 15; // 标识15位身份证号码

		var MAX_MAINLAND_AREACODE = 659004; // 大陆地区地域编码最大值
		var MIN_MAINLAND_AREACODE = 110000; // 大陆地区地域编码最小值
		var HONGKONG_AREACODE = 810000; // 香港地域编码值
		var TAIWAN_AREACODE = 710000; // 台湾地域编码值
		var MACAO_AREACODE = 820000; // 澳门地域编码值

		var MAN_SEX = 1; // 标识男性
		var WOMAN_SEX = 2; // 标识女性
		// 储存18位身份证校验码
		var SORTCODES = [ "1", "0", "X", "9", "8", "7", "6", "5", "4", "3", "2" ];
		var a = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ];
		
		/**
		 * 验证身份证主方法
		 */
		function chekIdCard( sex, idCardInput) {
			if (idCardInput == null || idCardInput == "" )
				return "身份证号码为必填";
			if (idCardInput.length != 18 && idCardInput.length != 15)
				return "身份证号码位数不符";
			if (idCardInput.length == 15)
				return checkIdCard15(sex, idCardInput);
			else
				return checkIdCard18(sex, idCardInput);
		}

		/**
		 * 验证15位身份证号码
		 */
		function checkIdCard15(sex, idCardInput) {
			var numberResult = checkNumber(FIFTEEN_IDCARD, idCardInput);
			if ( ACCEPT != numberResult )
				return numberResult;

			var  areaResult = checkArea(idCardInput);
			if ( ACCEPT != areaResult )
				return areaResult;

			var birthResult = checkBirthDate(FIFTEEN_IDCARD, idCardInput);
			if ( ACCEPT != birthResult )
				return birthResult;

			var sortCodeResult = checkSortCode(FIFTEEN_IDCARD, sex, idCardInput);
			if ( ACCEPT != sortCodeResult )
				return sortCodeResult;

			var checkCodeResult = checkCheckCode(FIFTEEN_IDCARD, idCardInput);
			if ( ACCEPT != checkCodeResult )
				return checkCodeResult;

			return ACCEPT;
		}
		
		
		/**
		 * 验证18位身份证号码
		 */
		function checkIdCard18( sex, idCardInput) {

			var numberResult = checkNumber(EIGHTEEN_IDCARD, idCardInput);
			if ( ACCEPT != numberResult )
				return numberResult;

			var areaResult = checkArea(idCardInput);
			if ( ACCEPT != areaResult )
				return areaResult;

			var birthResult = checkBirthDate(EIGHTEEN_IDCARD, idCardInput);
			if ( ACCEPT != birthResult )
				return birthResult;

			var sortCodeResult = checkSortCode(EIGHTEEN_IDCARD, sex, idCardInput);
			if ( ACCEPT != sortCodeResult )
				return sortCodeResult;

			var checkCodeResult = checkCheckCode(EIGHTEEN_IDCARD, idCardInput);
			if ( ACCEPT != checkCodeResult )
				return checkCodeResult;

			return ACCEPT;
		}
		
		/**
		 * 验证身份证的地域编码是符合规则
		 */
		function checkArea( idCardInput) {
			var subStr = idCardInput.substring(0, 6);
			var areaCode = Number(subStr);
			if (areaCode != HONGKONG_AREACODE && areaCode != TAIWAN_AREACODE && areaCode != MACAO_AREACODE
					&& (areaCode > MAX_MAINLAND_AREACODE || areaCode < MIN_MAINLAND_AREACODE))
				return "输入的身份证号码地域编码不符合大陆和港澳台规则";
			return ACCEPT;
		}

		/**
		 * 验证身份证号码数字字母组成是否符合规则
		 */
		function checkNumber( idCardType, idCard ) {
			var chars = [];
			for(var i =0, len = idCard.length; i < len; i++) { 
				chars.push(idCard[i]);
			}
			if (idCardType == FIFTEEN_IDCARD) {
				for (var i = 0; i < chars.length; i++) {
					if (chars[i] > '9')
						return idCardType + "位身份证号码中不能出现字母";
				}
			} else {
				for (var i = 0; i < chars.length; i++) {
					if (i < chars.length - 1) {
						if (chars[i] > '9')
							return EIGHTEEN_IDCARD + "位身份证号码中前" + (EIGHTEEN_IDCARD - 1) + "不能出现字母";
					} else {
						if (chars[i] > '9' && chars[i] != 'X')
							return idCardType + "位身份证号码中最后一位只能是数字0~9或字母X";
					}
				}

			}

			return ACCEPT;
		}
		
		
		
		/**
		 * 验证身份证号码出生日期是否符合规则
		 */
		function checkBirthDate( idCardType, idCardInput ) {
			var yearResult = checkBirthYear(idCardType, idCardInput);
			if ( ACCEPT != yearResult )
				return yearResult;

			var monthResult = checkBirthMonth(idCardType, idCardInput);
			if ( ACCEPT != monthResult )
				return monthResult;

			var dayResult = checkBirthDay(idCardType, idCardInput);
			if ( ACCEPT != dayResult )
				return dayResult;

			return ACCEPT;
		}
		
		
		/**
		 * 返回当前年份
		 */
		function getYear() {
			var now = new Date();
			return now.getFullYear();
		}
		
		/**
		 * 验证身份证号码出生日期年份是否符合规则
		 */
		function checkBirthYear( idCardType, idCardInput ) {
			if (idCardType == FIFTEEN_IDCARD) {
				var year = Number(idCardInput.substring(6, 8));
				if (year < 0 || year > 99)
					return idCardType + "位的身份证号码年份须在00~99内";
			} else {
				var year = Number(idCardInput.substring(6, 10));
				var yearNow = getYear();
				if (year < 1900 || year > yearNow)
					return idCardType + "位的身份证号码年份须在1900~" + yearNow + "内";
			}
			return ACCEPT;
		}

		/**
		 * 验证身份证号码出生日期月份是否符合规则
		 */
		function checkBirthMonth( idCardType, idCardInput ) {
			var month = 0;
			if (idCardType == FIFTEEN_IDCARD)
				month = Number(idCardInput.substring(8, 10));
			else
				month = Number(idCardInput.substring(10, 12));

			if (month < 1 || month > 12)
				return "身份证号码月份须在01~12内";

			return ACCEPT;
		}

		/**
		 * 验证身份证号码出生日期天数是否符合规则
		 */
		function checkBirthDay( idCardType, idCardInput ) {
			var  bissextile = false;
			var  year, month, day;
			if (idCardType == FIFTEEN_IDCARD) {
				year = Number("19" + idCardInput.substring(6, 8));
				month = Number(idCardInput.substring(8, 10));
				day = Number(idCardInput.substring(10, 12));
			} else {
				year = Number(idCardInput.substring(6, 10));
				month = Number(idCardInput.substring(10, 12));
				day = Number(idCardInput.substring(12, 14));
			}
			if (year % 4 == 0 && year % 100 != 0 || year % 400 == 0)
				bissextile = true;

			switch (month) {
			case 1:
			case 3:
			case 5:
			case 7:
			case 8:
			case 10:
			case 12:
				if (day < 1 || day > 31)
					return "身份证号码大月日期须在1~31之间";
				break;
			case 4:
			case 6:
			case 9:
			case 11:
				if (day < 1 || day > 30)
					return "身份证号码小月日期须在1~30之间";
				break;
			case 2:
				if (bissextile) {
					if (day < 1 || day > 29)
						return "身份证号码闰年2月日期须在1~29之间";
				} else {
					if (day < 1 || day > 28)
						return "身份证号码非闰年2月日期年份须在1~28之间";
				}
				break;
			}
			return ACCEPT;
		}
		
		
		/**
		 * 验证身份证号码顺序码是否符合规则,男性为偶数,女性为奇数
		 */
		function checkSortCode( idCardType, sex, idCardInput ) {
			var sortCode = 0;
			if (idCardType == FIFTEEN_IDCARD) {
				sortCode = Number(idCardInput.substring(12, 15));
			} else {
				sortCode = Number(idCardInput.substring(14, 17));
			}
			return ACCEPT;
		}

		/**
		 * 验证18位身份证号码校验码是否符合规则
		 */
		function checkCheckCode( idCardType, idCard ) {
			if (idCardType == EIGHTEEN_IDCARD) {
				var sum = 0;
				var sigma = 0;
				for (var i = 0; i < 17; i++) {
					var ai = Number(idCard.substring(i, i + 1));
					var wi = a[i];
					sigma += ai * wi;
				}
				var number = sigma % 11;
				var check_number = SORTCODES[number];

				// ========

				if ( check_number != idCard.substring(17) ) {
					return "身份中的校验码不正确";
				}
			}
			return ACCEPT;
		}
		
		
		
		
		/**
		 * 判断身份证号是否合法
		 * 
		 * @param IDNO
		 * @return
		 */
		function checkIdNo( IDNO ) {
			var  len = IDNO.length;
			// 验证身份证
			var sortCode = 0;
			var MAN_SEX = 0;
			if (len == 15) {
				sortCode = Number(IDNO.substring(12, 15));
			} else {
				sortCode = Number(IDNO.substring(14, 17));
			}

			if (sortCode % 2 == 0) {
				MAN_SEX = 2;// 女性身份证
			} else if (sortCode % 2 != 0) {
				MAN_SEX = 1;// 男性身份证
			} else {
				return false;
			}
			var iDresutl = "";
			iDresutl = chekIdCard(MAN_SEX, IDNO);
			if ( iDresutl == "" ) {
				return true;
			}
			return iDresutl;
		}

		/**
		 * 根据生日判断是否满 num 周岁  这里不判断
		 * 
		 * @param birthDay
		 * @return
		 */
		/*public boolean checkIdNo( birthDay, num) {
			try {
				var a = false;
				var birthDay = UtilDate.formateDate(birthDay);
				SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
				Date now = new Date();
				String dateNowString = format.format(now);
				String[] date = birthDay.split("-");
				String[] dateNow = dateNowString.split("-");

				int year = Integer.valueOf(date[0]);
				int month = Integer.valueOf(date[1]);
				int day = Integer.valueOf(date[2]);
				int yearNow = Integer.valueOf(dateNow[0]);
				int monthNow = Integer.valueOf(dateNow[1]);
				int dayNow = Integer.valueOf(dateNow[2]);
				if (yearNow - year > num) {
					a = true;
				} else if (yearNow - year < num) {
					a = false;
				} else {
					if (monthNow > month) {
						a = true;
					} else if (monthNow < month) {
						a = false;
					} else {
						if (dayNow >= day) {
							a = true;
						} else {
							a = false;
						}

					}
				}
				return a;
			} catch (Exception e) {
			}
			return false;
		}
		*/
		
		window.checkIdNo = checkIdNo;
	});
})(jQuery);