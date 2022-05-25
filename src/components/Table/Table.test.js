import React from 'react';
import { render, screen, waitForElement } from '@testing-library/react';
import Table from './index';
import '@testing-library/jest-dom/extend-expect';

describe ('<Table />', () => {
  
    test('renders Table', () => {
        render(<Table />);
    });

    test ('Should show the tenants in the table', async () => {

        const mockTenants = [
            {
                id: 4,
                name: 'Emrys Mcguire',
                paymentStatus: 'LATE',
                leaseEndDate: '20-10-2021 04:21:52'
              },
              {
                id: 5,
                name: 'Tamar Robertson',
                paymentStatus: 'CURRENT',
                leaseEndDate: '20-10-2021 04:21:52'
              }
        ]

        const { getByText, container } = render(<Table tenants={mockTenants} setTenants={jest.fn()} tab='tab1' />);

        await waitForElement(() => screen.getByText(/add tenant/i)).then(() => {

            screen.debug(container);
            const name = getByText(/name/i);
            const paymentStatus = getByText(/Payment Status/i);
            const leaseEndDate = getByText(/Lease End Date/i);
            const actions = getByText(/actions/i);
            
            const tenant1 = getByText(/Emrys Mcguire/i);
            const tenant2 = getByText(/Tamar Robertson/i);
    
    
            
            expect(name).toBeInTheDocument();
            expect(paymentStatus).toBeInTheDocument();
            expect(leaseEndDate).toBeInTheDocument();
            expect(actions).toBeInTheDocument();
    
            expect(tenant1).toBeInTheDocument();
            expect(tenant2).toBeInTheDocument();

        }).catch((error) => {

            console.log(error);

        });


    }) 

});
