// @flow
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { computed } from 'mobx';
import environment from '../environment';
import CenteredLayout from '../components/layout/CenteredLayout';
import Loading from '../components/loading/Loading';
import type { InjectedOrGenerated } from '../types/injectedPropsType';
import { handleExternalLinkClick } from '../utils/routing';
import { downloadLogs } from '../utils/logging';
import LocalizableError from '../i18n/LocalizableError';

type GeneratedData = {|
  +stores: {|
    +profile: {|
      +hasLoadedCurrentLocale: boolean,
      +hasLoadedCurrentTheme: boolean,
    |},
    +loading: {|
      +isLoading: boolean,
      +error: ?LocalizableError,
    |},
  |},
  +handleExternalLinkClick: MouseEvent => void,
  +downloadLogs: void => void,
|};

@observer
export default class LoadingPage extends Component<InjectedOrGenerated<GeneratedData>> {

  @computed get generated(): GeneratedData {
    if (this.props.generated !== undefined) {
      return this.props.generated;
    }
    if (this.props.stores == null || this.props.actions == null) {
      throw new Error(`${nameof(LoadingPage)} no way to generated props`);
    }
    const { stores, } = this.props;
    const { profile, loading } = stores;
    return Object.freeze({
      stores: {
        profile: {
          hasLoadedCurrentLocale: profile.hasLoadedCurrentLocale,
          hasLoadedCurrentTheme: profile.hasLoadedCurrentTheme,
        },
        loading: {
          isLoading: loading.isLoading,
          error: loading.error,
        },
      },
      downloadLogs,
      handleExternalLinkClick,
    });
  }

  render() {
    return (
      <CenteredLayout>
        <Loading
          api={environment.API}
          hasLoadedCurrentLocale={this.generated.stores.profile.hasLoadedCurrentLocale}
          hasLoadedCurrentTheme={this.generated.stores.profile.hasLoadedCurrentTheme}
          isLoadingDataForNextScreen={this.generated.stores.loading.isLoading}
          error={this.generated.stores.loading.error}
          onExternalLinkClick={this.generated.handleExternalLinkClick}
          downloadLogs={this.generated.downloadLogs}
        />
      </CenteredLayout>
    );
  }
}
