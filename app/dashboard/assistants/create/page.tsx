
// import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
// import { fetchCustomers } from '@/app/lib/data';

import { CreateForm } from "../components/create-form";


export default async function Page() {
    // const customers = await fetchCustomers();

    return (
        <main>
            {/*<Breadcrumbs*/}
            {/*    breadcrumbs={[*/}
            {/*        { label: 'Assistants', href: '/assistants' },*/}
            {/*        {*/}
            {/*            label: 'Create Assistants',*/}
            {/*            href: '/assistants/create',*/}
            {/*            active: true,*/}
            {/*        },*/}
            {/*    ]}*/}
            {/*/>*/}
            <CreateForm  />
        </main>
    );
}