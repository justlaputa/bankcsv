Data model

```yaml
C:Cards
- vpass_ana:
    name: Vpass ANA Card
    brand: VISA
    bank: SMBC
    billing_date: 10
    C:bills:
    - 20200110:
        confirmed: true
        billing_month: 202001
        billing_date: 20200110
        total_amount: 10123
        C:transactions:
        - _id:
            date: 20200101
            amount: 1234
        - _id:
    - 20200210:
        confirmed: false
        total_amount: 23423
        C:transactions:
        - _id:
        - _id:
- vpass_line:
- tokyu_tokyu:

```