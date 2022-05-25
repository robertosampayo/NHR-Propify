import React from 'react';
import { render, screen, fireEvent, waitForElement } from '@testing-library/react';
import '@testing-library/jest-dom'
import Form from '../../App';

describe ('<Form />', () => {
  
    test('renders Form', () => {

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

        render(<Form tenants={mockTenants} setTenants={jest.fn()} setError={jest.fn()} />);
    });


    test ('Should open form, type info of new tenant and valid save button', async () => {

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

        const { getByText, getByLabelText } = render(<Form tenants={mockTenants} setTenants={jest.fn()} setError={jest.fn()} />);


        await waitForElement(() => screen.getByText(/add tenant/i)).then(() => {

                    const addTenantButton = getByText(/add tenant/i);
                    fireEvent.click(addTenantButton)


                    const name = getByLabelText(/name/i);
                    const paymentStatus = getByLabelText(/Payment Status/i);
                    const leaseEndDate = getByLabelText(/Lease End Date/i);

                    fireEvent.change(name, {target: {value: 'Roger'}})
                    expect(name.value).toBe('Roger')

                    fireEvent.change(paymentStatus, {target: {value: 'CURRENT'}})
                    expect(paymentStatus.value).toBe('CURRENT')

                    fireEvent.change(leaseEndDate, {target: {value: '25-05-2022'}})
                    expect(leaseEndDate.value).toBe('25-05-2022')

                    const save = getByText(/save/i);
                    expect(save.getAttribute('disabled')).toBe(null);

                    fireEvent.change(leaseEndDate, {target: {value: 'dasd'}})
                    expect(leaseEndDate.value).toBe('dasd')

                    expect(save.getAttribute('disabled')).toBe('');

        }).catch((error) => {

                console.log(error);

        } );




        

    }) 

});
