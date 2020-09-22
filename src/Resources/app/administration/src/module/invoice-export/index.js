import './page/invoice-export-create';
import deDE from './snippet/de-DE';
import enGB from './snippet/en-GB';

Shopware.Module.register('invoice-export', {
    name: 'invoice-export.general.name',
    type: 'plugin',
    color: '#ff3d58',
    icon: 'default-action-move-file',
    title: 'invoice-export.general.title',
    description: 'invoice-export.general.description',

    routes: {
        create: {
            component: 'invoice-export-create',
            path: 'create',
            meta: {
                parentPath: 'invoice.export.create'
            }
        },
    },

    navigation: [{
        label: 'invoice-export.navigation.label',
        color: '#ffffff',
        path: 'invoice.export.create',
        icon: 'default-action-move-file',
        position: 100,
        parent: 'sw-order'
    }],

    snippets: {
        'de-DE': deDE,
        'en-GB': enGB,
    },

});
