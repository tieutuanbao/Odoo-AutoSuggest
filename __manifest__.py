{
    'name': 'Bits-AutoSuggest',
    'version': '1.0',
    'summary': 'Tự động đề xuất tên sản phẩm khi nhập tên sản phẩm mới',
    'description': 'This module provides features for create new products in Odoo.',
    'author': 'BitsCat',
    'category': 'Product',
    'depends': ['product'],
    'data': [
        'views/product_views.xml',
    ],
    'assets': {
        'web.assets_backend': [
            'bits_autosuggest/static/src/js/name_autocomplete.js',
            'bits_autosuggest/static/src/xml/name_autocomplete_template.xml',
        ],
    },
    'installable': True,
    'application': True,
}
