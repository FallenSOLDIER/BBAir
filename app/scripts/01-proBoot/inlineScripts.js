/*
 * Nothing wants to make me scream more than to see inline stuff
 * Scripts and styles DO NOT EVER IN THE WORLD belong with HTML unless
 * its purely for fun or development. Production ready stuff should NOT EVER have them
 * in there
 * 
 * Also while I'm ranting, why on this green earth does phpBB have scripts and images
 * scattered all over the place. Scripts go in one main folder for scripts, they can
 * be sub-categorized into subfolders under that one main folder purely for scripts.
 * 
 * CSS, images, videos, html, they all go into there own respective folders
 * Basically a typical phpBB style to me looks like trash thrown all over
 * the place, like somone just took code and started slapping stuff together
 * to see if it would make something.
 * 
 * Organize stuff, please for anything have deeply unquestionable clear-cut rules
 * and hard set very clear unquestionable ways and methods that you can logically build
 * upon and that make perfect sense. Have logic and organization people. 
 * 
 * ....>_<.......
*/

var jump_page = '{LA_JUMP_PAGE}:';
	var on_page = '{ON_PAGE}';
	var per_page = '{PER_PAGE}';
	var base_url = '{A_BASE_URL}';
	var style_cookie = 'phpBBstyle';
	var style_cookie_settings = '{A_COOKIE_SETTINGS}';
	var onload_functions = new Array();
	var onunload_functions = new Array();

	<!-- IF S_USER_PM_POPUP and S_NEW_PM -->
		var url = '{UA_POPUP_PM}';
		window.open(url.replace(/&amp;/g, '&'), '_phpbbprivmsg', 'height=225,resizable=yes,scrollbars=yes, width=400');
	<!-- ENDIF -->

	/**
	* Find a member
	*/
	function find_username(url)
	{
		popup(url, 760, 570, '_usersearch');
		return false;
	}

	/**
	* New function for handling multiple calls to window.onload and window.unload by pentapenguin
	*/
	window.onload = function()
	{
		for (var i = 0; i < onload_functions.length; i++)
		{
			eval(onload_functions[i]);
		}
	};

	window.onunload = function()
	{
		for (var i = 0; i < onunload_functions.length; i++)
		{
			eval(onunload_functions[i]);
		}
	};

