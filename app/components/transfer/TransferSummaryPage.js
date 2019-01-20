// @flow
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import classnames from 'classnames';
import Button from 'react-polymorph/lib/components/Button';
import SimpleButtonSkin from 'react-polymorph/lib/skins/simple/raw/ButtonSkin';
import { defineMessages, intlShape } from 'react-intl';
import BorderedBox from '../widgets/BorderedBox';
import ReactToolboxMobxForm from '../../utils/ReactToolboxMobxForm';
import styles from './TransferSummaryPage.scss';
import MemoArea from '../wallet/send/MemoArea';
import type { TransferTx } from '../../types/TransferTypes';
import LocalizableError from '../../i18n/LocalizableError';

const messages = defineMessages({
  addressFromLabel: {
    id: 'transfer.summary.addressFrom.label',
    defaultMessage: '!!!From',
    description: 'Label showing addresses where the tx will be from',
  },
  addressToLabel: {
    id: 'transfer.summary.addressTo.label',
    defaultMessage: '!!!To',
    description: 'Label showing addresses where the tx will be sent',
  },
  recoveredBalanceLabel: {
    id: 'transfer.summary.recoveredBalance.label',
    defaultMessage: '!!!Recovered balance',
    description: 'Label showing total recovered balance',
  },
  transactionFeeLabel: {
    id: 'transfer.summary.transactionFee.label',
    defaultMessage: '!!!Transaction fees',
    description: 'Label showing transaction fees when transferring',
  },
  finalBalanceLabel: {
    id: 'transfer.summary.finalBalance.label',
    defaultMessage: '!!!Final balance',
    description: 'Label showing final balance',
  },
  cancelTransferButtonLabel: {
    id: 'transfer.summary.cancelTransferButton.label',
    defaultMessage: '!!!Cancel',
    description: 'Cancel button text',
  },
  transferButtonLabel: {
    id: 'transfer.summary.transferButton.label',
    defaultMessage: '!!!Transfer Funds',
    description: 'Do tansfer button text',
  },
  memoPlaceholder: {
    id: 'wallet.send.memo.placeholder',
    defaultMessage: '!!!Add memo to your transaction',
    description: 'Placeholder for memo textarea',
  },
});

type Props = {
  formattedWalletAmount: Function,
  transferTx: TransferTx,
  onSubmit: Function,
  isSubmitting: boolean,
  onCancel: Function,
  error: ?LocalizableError,
  addressFromSubLabel: string,
  dropboxToken: string,
};

/** Show user what the transfer would do to get final confirmation */
@observer
export default class TransferSummaryPage extends Component<Props> {

  static contextTypes = {
    intl: intlShape.isRequired
  };

  form = new ReactToolboxMobxForm({
    fields: {
      memo: {
        label: ' ',
        placeholder: this.context.intl.formatMessage(messages.memoPlaceholder),
        value: '',
      }
    },
  });

  render() {
    const { intl } = this.context;
    const {
      transferTx,
      isSubmitting,
      error,
      addressFromSubLabel,
      dropboxToken,
    } = this.props;
    const { form } = this;
    const memoValue = form.$('memo').value;

    const receiver = transferTx.receiver;
    const recoveredBalance = this.props.formattedWalletAmount(transferTx.recoveredBalance);
    const transactionFee = this.props.formattedWalletAmount(transferTx.fee);
    const finalBalance = this.props.formattedWalletAmount(
      transferTx.recoveredBalance.minus(transferTx.fee)
    );

    const nextButtonClasses = classnames([
      'transferButton',
      isSubmitting ? styles.isSubmitting : 'primary',
      styles.button,
    ]);

    const cancelButtonClasses = classnames([
      'cancelTransferButton',
      'flat',
      styles.button,
    ]);
    return (
      <div className={styles.component}>
        <BorderedBox>

          <div className={styles.body}>
            <div className={styles.addressLabelWrapper}>
              <div className={styles.addressLabel}>
                {intl.formatMessage(messages.addressFromLabel)}
              </div>
              <div className={styles.addressSubLabel}>
                {addressFromSubLabel}
              </div>
              {
                transferTx.senders.map((sender, index) => {
                  const addressesClasses = classnames([
                    'addressRecovered-' + (index + 1),
                    styles.address
                  ]);

                  return (
                    // eslint-disable-next-line react/no-array-index-key
                    <div key={index} className={addressesClasses}>{sender}</div>
                  );
                })
              }
            </div>

            <div className={styles.addressLabelWrapper}>
              <div className={styles.addressLabel}>
                {intl.formatMessage(messages.addressToLabel)}
              </div>
              <div className={styles.address}>{receiver}</div>
            </div>

            <div className={styles.amountFeesWrapper}>
              <div className={styles.amountWrapper}>
                <div className={styles.amountLabel}>
                  {intl.formatMessage(messages.recoveredBalanceLabel)}
                </div>
                <div className={styles.amount}>{recoveredBalance}
                  <span className={styles.currencySymbol}>&nbsp;ADA</span>
                </div>
              </div>

              <div className={styles.feesWrapper}>
                <div className={styles.feesLabel}>
                  {intl.formatMessage(messages.transactionFeeLabel)}
                </div>
                <div className={styles.fees}>+{transactionFee}
                  <span className={styles.currencySymbol}>&nbsp;ADA</span>
                </div>
              </div>
            </div>

            <div className={styles.totalAmountWrapper}>
              <div className={styles.totalAmountLabel}>
                {intl.formatMessage(messages.finalBalanceLabel)}
              </div>
              <div className={styles.totalAmount}>{finalBalance}
                <span className={styles.currencySymbol}>&nbsp;ADA</span>
              </div>
            </div>

            <div className={styles.errorWrapper}>
              {
                error && !isSubmitting &&
                  <p className={styles.error}>{intl.formatMessage(error)}</p>
              }
            </div>

            <MemoArea dropboxToken={dropboxToken} intl={intl} form={this.form} />

            <div className={styles.buttonsWrapper}>
              <Button
                className={cancelButtonClasses}
                label={intl.formatMessage(messages.cancelTransferButtonLabel)}
                onClick={this.props.onCancel}
                disabled={isSubmitting}
                skin={<SimpleButtonSkin />}
              />

              <Button
                className={nextButtonClasses}
                label={intl.formatMessage(messages.transferButtonLabel)}
                onClick={this.props.onSubmit(memoValue)}
                disabled={isSubmitting}
                skin={<SimpleButtonSkin />}
              />
            </div>

          </div>

        </BorderedBox>

      </div>
    );
  }
}
