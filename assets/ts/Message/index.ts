const $ = require('jquery');

/**
 *
 */
export class Message
{
	private static modal: string = '#messageModal';

	/**
	 *
	 */
	public static show = (title: string, content: string) => {
		$('.modal-title', this.modal).html(title);
		$('.modal-body', this.modal).html(content);
		$('#messageModal').modal('show');
	}
}