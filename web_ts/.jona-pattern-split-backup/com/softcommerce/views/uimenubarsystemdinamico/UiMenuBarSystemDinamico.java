/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.softcommerce.views.uimenubarsystemdinamico;

import com.softcommerce.beans.MenuDinamico;
import com.softcommerce.beans.Usuario;
import com.softcommerce.general.controles.CMenu;
import com.softcommerce.general.controles.CMenuBar;
import com.softcommerce.general.controles.CMenuItem;
import com.softcommerce.iconos.Gif;
import com.softcommerce.reglasnegocio.RnUsuario;
import com.softcommerce.views.uihomesesion.InterUiHomeSesion;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.util.ArrayList;
import java.util.List;
import javax.swing.JButton;
import javax.swing.JOptionPane;
import java.net.URL;
import org.apache.log4j.Logger;

public class UiMenuBarSystemDinamico
        extends CMenuBar
        implements ActionListener, InterUiMenuBarSystemDinamico {

    private static final long serialVersionUID = 1L;
    private final InterUiHomeSesion frmsys;
    public URL path;
    CMenu[] menus;
    CMenuItem[] menusItem;
    List<Integer> vectorMenu;
    List<Integer> vectorMenuItem;
    private final Usuario usuario;
    private Gif gif;
    private JButton btn;
    private final Logger logger = Logger.getLogger(UiMenuBarSystemDinamico.class);

    public UiMenuBarSystemDinamico(InterUiHomeSesion frmsys, java.net.URL path, Usuario user) {
        super();
        this.frmsys = frmsys;
        this.path = path;
        this.usuario = user;
        initialize();
    }

    private void initialize() {
        llenarMenu();
        gif = new Gif();
        llenarIcon();
    }

    private void llenarIcon() {
        btn = new JButton(gif.UP);
        btn.addActionListener(this);
        this.add(btn);
    }

    private void llenarMenu() {
        try {
            vectorMenu = new ArrayList();
            vectorMenuItem = new ArrayList();
            RnUsuario logic_usuario = new RnUsuario(path);
            List<MenuDinamico> listado = logic_usuario.cargaMenuUsuario(usuario.getId_usuario(), "M");
            int cantMenu = 0;
            for (int i = 0; i < listado.size(); i++) {
                MenuDinamico beanmenu = (MenuDinamico) listado.get(i);
                if (beanmenu.getMenu_item().trim().equals("N")) {
                    cantMenu += 1;
                }
            }
            menus = new CMenu[cantMenu];
            menusItem = new CMenuItem[listado.size() - cantMenu];
            for (int i = 0; i < listado.size(); i++) {
                MenuDinamico beanmenu = (MenuDinamico) listado.get(i);
                if (beanmenu.getMenu_item().trim().equals("N")) {
                    armarMenu(beanmenu.getId_menu(), beanmenu.getDescripcion());
                } else {
                    armarMenuItem(beanmenu.getId_menu(), beanmenu.getDescripcion());
                }
            }
            for (int i = 0; i < listado.size(); i++) {
                MenuDinamico beanmenu = (MenuDinamico) listado.get(i);
                if (beanmenu.getId_menu_padre() >= 0) {
                    if (beanmenu.getMenu_item().trim().equals("N")) {
                        cargarMenu(posMenu(beanmenu.getId_menu_padre()), posMenu(beanmenu.getId_menu()));
                    } else {
                        cargarMenuItem(posMenu(beanmenu.getId_menu_padre()), posMenuItem(beanmenu.getId_menu()), beanmenu.getNombre());
                    }
                } else {
                    cargarBarra(posMenu(beanmenu.getId_menu()));
                }
            }
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    private int posMenu(int id_menu) {
        for (int i = 0; i < vectorMenu.size(); i++) {
            if (vectorMenu.get(i) == id_menu) {
                return i;
            }
        }
        return -1;
    }

    private int posMenuItem(int id_menu) {
        for (int i = 0; i < vectorMenuItem.size(); i++) {
            if (vectorMenuItem.get(i) == id_menu) {
                return i;
            }
        }
        return -1;
    }

    private void armarMenu(int indice, String menu) {
        this.menus[vectorMenu.size()] = new CMenu(menu);
        vectorMenu.add(indice);
    }

    private void armarMenuItem(int indice, String menu) {
        this.menusItem[vectorMenuItem.size()] = new CMenuItem(menu);
        vectorMenuItem.add(indice);
    }

    private void cargarBarra(int indice) {
        add(this.menus[indice]);
    }

    private void cargarMenu(int indPadre, int indice) {
        if (indPadre >= 0 && indice >= 0) {
            this.menus[indPadre].add(this.menus[indice]);
        }
    }

    private void cargarMenuItem(int indPadre, int indice, final String nombre) {
        if (indPadre >= 0 && indice >= 0) {
            this.menus[indPadre].add(this.menusItem[indice]);
            this.menusItem[indice].addActionListener(new ActionListener() {
                @Override
                public void actionPerformed(ActionEvent e) {
                    llamarEvento(nombre);
                }
            });
        }
    }

    @Override
    public void llamarEvento(String nombre) {
        logger.info("Nombre Menu " + nombre);
        if (nombre.trim().equals("mi_localidad")) {
            frmsys.showLocalidad();
        } else if (nombre.trim().equals("mi_puntoventa")) {
            frmsys.showPuntoVenta();
        } else if (nombre.trim().equals("mi_almacen")) {
            frmsys.showAlmacen();
        } else if (nombre.trim().equals("miProveedor")) {
            frmsys.showProveedorNuevo();
        } else if (nombre.trim().equals("miTransportista")) {
            frmsys.showTransportista();
        } else if (nombre.trim().equals("miBancoAnexo")) {
            frmsys.showBancoAnexo();
        } else if (nombre.trim().equals("miChofer")) {
            frmsys.showChofer();
        } else if (nombre.trim().equals("miCliente")) {
            frmsys.showClienteNuevo();
        } else if (nombre.trim().equals("miSocio")) {
            frmsys.showSocio();
        } else if (nombre.trim().equals("miAccionSocio")) {
            frmsys.showFormAccionSocio();
        } else if (nombre.trim().equals("miVendedor")) {
            frmsys.showVendedor();
        } else if (nombre.trim().equals("miTrabajador")) {
            frmsys.showTrabajador();
        } else if (nombre.trim().equals("miProducto")) {
            frmsys.showItem();
        } else if (nombre.trim().equals("miColor")) {
            frmsys.showColor();
        } else if (nombre.trim().equals("miFamilia")) {
            frmsys.showFamilia();
        } else if (nombre.trim().equals("miLaboratorioClinico")) {
            frmsys.showLaboratorioClinico();
        } else if (nombre.trim().equals("miSubFamilia")) {
            frmsys.showSubFamilia();
        } else if (nombre.trim().equals("miMarca")) {
            frmsys.showMarca();
        } else if (nombre.trim().equals("miUnidadMedida")) {
            frmsys.showUnidadMedida();
        } else if (nombre.trim().equals("miTamano")) {
            frmsys.showTamano();
        } else if (nombre.trim().equals("miAduana")) {
            frmsys.showAduana();
        } else if (nombre.trim().equals("miTipoTrabajador")) {
            frmsys.showTipoTrabajador();
        } else if (nombre.trim().equals("miTipoTrabajadorPerfil")) {
            frmsys.showTipoTrabajadorPerfil();
        } else if (nombre.trim().equals("miTipoPago")) {
            frmsys.showTipoPago();
        } else if (nombre.trim().equals("miTipoCambio")) {
            frmsys.showTipoCambio();
        } else if (nombre.trim().equals("miVehiculo")) {
            frmsys.showVehiculo();
        } else if (nombre.trim().equals("miMarcaVehiculo")) {
            frmsys.showMarcaVehiculo();
        } else if (nombre.trim().equals("miModeloVehiculo")) {
            frmsys.showModeloVehiculo();
        } else if (nombre.trim().equals("miTipoDescuento")) {
            frmsys.showTipoDescuento();
        } else if (nombre.trim().equals("miMotivoDescuento")) {
            frmsys.showMotivoDescuento();
        } else if (nombre.trim().equals("miClasifCliente")) {
            frmsys.showClasifCliente();
        } else if (nombre.trim().equals("miPromocion")) {
            frmsys.showPromocion();
        } else if (nombre.trim().equals("miTablaSunat")) {
            frmsys.showTablaSunat();
        } else if (nombre.trim().equals("miTipoCuenta")) {
            frmsys.showTipoCuenta();
        } else if (nombre.trim().equals("miTurno")) {
            frmsys.showTurno();
        } else if (nombre.trim().equals("miOperacion")) {
            frmsys.showTipoOperacion();
        } else if (nombre.trim().equals("miEstadoCivil")) {
            frmsys.showEstadoCivil();
        } else if (nombre.trim().equals("miOrigenOperacion")) {
            frmsys.showOrigenOperacion();
        } else if (nombre.trim().equals("miTipoMovCaja")) {
            frmsys.showTipoMovCaja();
        } else if (nombre.trim().equals("miTipoOperacion")) {
            frmsys.showClaseOperacion();
        } else if (nombre.trim().equals("miClasifBanco")) {
            frmsys.showClasifBanco();
        } else if (nombre.trim().equals("miBanco")) {
            frmsys.showBanco();
        } else if (nombre.trim().equals("miDetraccionSunat")) {
            frmsys.showDetraccionSunat();
        } else if (nombre.trim().equals("miPercepcionSunat")) {
            frmsys.showPercepcionSunat();
        } else if (nombre.trim().equals("miEmpresaCuenta")) {
            frmsys.showEmpresaCuenta();
        } else if (nombre.trim().equals("miMoneda")) {
            frmsys.showMoneda();
        } else if (nombre.trim().equals("miMedioPago")) {
            frmsys.showMedioPago();
        } else if (nombre.trim().equals("miAuxiliar")) {
            frmsys.showAuxiliarContable();
        } else if (nombre.trim().equals("miDocIdentidad")) {
            frmsys.showTipoDocIden();
        } else if (nombre.trim().equals("miPlanCuentaSunat")) {
            frmsys.showCuentaSunat();
        } else if (nombre.trim().equals("miPlanCuenta")) {
            frmsys.showPlanCuenta();
        } else if (nombre.trim().equals("miDocVenta")) {
            frmsys.showTipoDocVenta();
        } else if (nombre.trim().equals("miImpuesto")) {
            frmsys.showImpuesto();
        } else if (nombre.trim().equals("miAgrupadorApertura")) {
            frmsys.showCuentaApertura();
        } else if (nombre.trim().equals("miAgrupadorCierre")) {
            frmsys.showCuentaCierre();
        } else if (nombre.trim().equals("miClasifCuenta")) {
            frmsys.showClasifCuenta();
        } else if (nombre.trim().equals("miOperacionSunat")) {
            frmsys.showOperacionSunat();
        } else if (nombre.trim().equals("miTablaDetalleSunat")) {
            frmsys.showTablaDetalleSunat();
        } else if (nombre.trim().equals("miZona")) {
            frmsys.showZona();
        } else if (nombre.trim().equals("miZonaDistancia")) {
            frmsys.showZonaDistancia();
        } else if (nombre.trim().equals("mi_CotizacionLista")) {
            frmsys.showCotizacionNuevo();
        } else if (nombre.trim().equals("mi_CotizacionRegistra")) {
            frmsys.showCotizacionReg();
        } else if (nombre.trim().equals("mi_PedidoLista")) {
            frmsys.showPedido();
        } else if (nombre.trim().equals("miReparto")) {
            frmsys.showReparto();
        } else if (nombre.trim().equals("mi_PedidoRegistra")) {
            frmsys.showPedidoReg();
        } else if (nombre.trim().equals("miListaPrecios")) {
            frmsys.showPreciosItems();
        } else if (nombre.trim().equals("miLiquidacion")) {
            frmsys.showLiquidacion();
        } else if (nombre.trim().equals("mi_notacredito")) {
            frmsys.showNotaCredito();
        } else if (nombre.trim().equals("mi_notadebito")) {
            frmsys.showNotaDebito();
        } else if (nombre.trim().equals("miCierreAperturaCaja")) {
            frmsys.showCierreAperturaCaja();
        } else if (nombre.trim().equals("miCierreAperturaFacturacion")) {
            frmsys.showCierreAperturaFacturacion();
        } else if (nombre.trim().equals("mi_VentaAdministra")) {
            frmsys.showBoleta();
        } else if (nombre.trim().equals("mi_VentaRegistra")) {
            frmsys.showVentaDirecta();
        } else if (nombre.trim().equals("mi_ServicioTransporte")) {
            frmsys.showServicioTransporte();
        } else if (nombre.trim().equals("miIngresos")) {
            frmsys.showIngresos();
        } else if (nombre.trim().equals("miDespacho")) {
            frmsys.showDespacho();
        } else if (nombre.trim().equals("miGuiaRemision")) {
            frmsys.showGuiaRemision();
        } else if (nombre.trim().equals("mi_notaajustesalida")) {
            frmsys.showNotaSalida();
        } else if (nombre.trim().equals("mi_CambiarAlmacen")) {
            frmsys.showCambiarAlmacen();
        } else if (nombre.trim().equals("mi_usuariocorrelativo")) {
            frmsys.showUsuarioCorrelativo();
        } else if (nombre.trim().equals("mi_parametro")) {
            frmsys.showParametro();
        } else if (nombre.trim().equals("mi_cambiarperiodo")) {
            frmsys.showCambiarPeriodoTrabajo();
        } else if (nombre.trim().equals("mi_principal")) {
            frmsys.showEmpresa();
        } else if (nombre.trim().equals("mPeriodoContable")) {
            frmsys.showPeriodoContable();
        } else if (nombre.trim().equals("mi_recalculo")) {
            frmsys.showRecalculoAmarre();
        } else if (nombre.trim().equals("mi_recalculoCtaDoc")) {
            frmsys.showRecalculoCtaDoc();
        } else if (nombre.trim().equals("m_Caja")) {
            frmsys.showCaja();
        } else if (nombre.trim().equals("miCajaChica")) {
            frmsys.showCajaChica();
        } else if (nombre.trim().equals("miParametroProvision")) {
            frmsys.showParametroProv();
        } else if (nombre.trim().equals("m_CajaSerie")) {
            frmsys.showCajaSerie();
        } else if (nombre.trim().equals("mi_desactivaritem")) {
            frmsys.showDesactivarItem();
        } else if (nombre.trim().equals("mi_usuario")) {
            frmsys.showUsuario();
        } else if (nombre.trim().equals("miTrabajadorPuntoVenta")) {
            frmsys.showTrabajadorPuntoVenta();
        } else if (nombre.trim().equals("miEstadoDocumento")) {
            frmsys.showEstadoDocumento();
        } else if (nombre.trim().equals("miMotivoNotaCredito")) {
            frmsys.showMotivoNotaCredito();
        } else if (nombre.trim().equals("miCondicionPago")) {
            frmsys.showCondicionPago();
        } else if (nombre.trim().equals("miMotivoTraslado")) {
            frmsys.showMotivoTraslado();
        } else if (nombre.trim().equals("miClasifInventario")) {
            frmsys.showClasifInventario();
        } else if (nombre.trim().equals("mi_configCosteo")) {
            frmsys.showConfigCosteo();
        } else if (nombre.trim().equals("estadoDV")) {
            frmsys.showFormRegularDV();
        } else if (nombre.trim().equals("miTipoMovInventario")) {
            frmsys.showTipoMovInventario();
        } else if (nombre.trim().equals("miClasifDocumento")) {
            frmsys.showClasifDocumento();
        } else if (nombre.trim().equals("miCorrelativo")) {
            frmsys.showCorrelativo();
        } else if (nombre.trim().equals("miReporteVentas")) {
            frmsys.showReporteVentas();
        } else if (nombre.trim().equals("miReporteCompras")) {
            frmsys.showReporteCompras();
        } else if (nombre.trim().equals("miReporteTesoreria")) {
            frmsys.showReporteCajaBancos();
        } else if (nombre.trim().equals("miAnticipoCliente")) {
            frmsys.showAnticipoCliente();
        } else if (nombre.trim().equals("miEntregaRendir")) {
            frmsys.showEntregaRendir();
        } else if (nombre.trim().equals("miDetraccion")) {
            frmsys.showDetraccionProveedor();
        } else if (nombre.trim().equals("miAplicacionReasignacion")) {
            frmsys.showAplicacionCliente();
        } else if (nombre.trim().equals("m_LetrasProv")) {
            frmsys.showLetrasProv();
        } else if (nombre.trim().equals("m_CanjeLetraCliente")) {
            frmsys.showLetrasCliente();
        } else if (nombre.trim().equals("miCobranzaCredito")) {
            frmsys.showCobranzaCreditos();
        } else if (nombre.trim().equals("miPrueba")) {
            frmsys.showCancProvGroup();
        } else if (nombre.trim().equals("miCancGrupCliente")) {
            frmsys.showCancClienteGroup();
        } else if (nombre.trim().equals("mi_consultastockHistorico")) {
            frmsys.showStockHistorico();
        } else if (nombre.trim().equals("miSalidaVenta")) {
            frmsys.showVerDocumentoVentaSalidas();
        } else if (nombre.trim().equals("miVerProductosxDespachar_v1")) {
            frmsys.showVerProductosDespachar();
        } else if (nombre.trim().equals("miVerProductosDespachados")) {
            frmsys.showVerMovimientoProductos();
        } else if (nombre.trim().equals("m_analisisCtaDetallado")) {
            frmsys.showAnalisisCuenta();
        } else if (nombre.trim().equals("mi_conConversion")) {
            frmsys.showAsientoContable();
        } else if (nombre.trim().equals("mi_eliminarAsiento")) {
            frmsys.showAsientoContableEliminar();
        } else if (nombre.trim().equals("m_RptListaPrecio")) {
            //frmsys.showReporteListaPrecio();
        } else if (nombre.trim().equals("mi_SeguridadPerfil")) {
            frmsys.showFormMenuPerfil();
        } else if (nombre.trim().equals("miOrdenPagoProv")) {
            frmsys.showRegisterOpProv();
        } else if (nombre.trim().equals("miSolRepCh")) {
            frmsys.showSolicitudRepCajaChica();
        } else if (nombre.trim().equals("miProvCompras")) {
            frmsys.showComprasGastos(false);
        } else if (nombre.trim().equals("miProvGastos")) {
            frmsys.showComprasGastos(true);
        } else if (nombre.trim().equals("miGenerarLibros")) {
            frmsys.showLibroElectronicoRpt();
        } else if (nombre.trim().equals("miCentralizarAsiento")) {
            frmsys.showCentralizaAsiento();
        } else if (nombre.trim().equals("miDevACCliente")) {
            frmsys.showDevolucionAcClie();
        } else if (nombre.trim().equals("miDevOPProv")) {
            frmsys.showDevolucionOpProv();
        } else if (nombre.trim().equals("miCancProv")) {
            frmsys.showCancelacionProvisionProv();
        } else if (nombre.trim().equals("miRetencionVenta")) {
            frmsys.showRetencionVenta();
        } else if (nombre.trim().equals("miPercepcionCompra")) {
            frmsys.showPercepcionCompra();
        } else if (nombre.trim().equals("miAplicOPProv")) {
            frmsys.showAplicacionOpProv();
        } else if (nombre.trim().equals("miAplicNCProv")) {
            frmsys.showAplicacionNcProv();
        } else if (nombre.trim().equals("miAplicProvPerc")) {
            frmsys.showAplicProvPerc();
        } else if (nombre.trim().equals("miDevNCCliente")) {
            frmsys.showDevolucionNcClie();
        } else if (nombre.trim().equals("miDevNCProv")) {
            frmsys.showDevolucionNcProv();
        } else if (nombre.trim().equals("miAnticipoPtoVta")) {
            frmsys.showRegisterAnticipoPtoVta();
        } else if (nombre.trim().equals("miTransBanco")) {
            frmsys.showRegisterTransferenciaBanc();
        } else if (nombre.trim().equals("miCxPIndividual")) {
            frmsys.showRegisterCancProvInd();
        } else if (nombre.trim().equals("miCxPGrupal")) {
            frmsys.showRegisterCancProvGrup();
        } else if (nombre.trim().equals("miPagoTrabajador")) {
            frmsys.showCancelacionTrabajador();
        } else if (nombre.trim().equals("miAplicRemuneracion")) {
            frmsys.showAplicacionTrabajador();
        } else if (nombre.trim().equals("miIngresosDiv")) {
            frmsys.showIngresosDiversos();
        } else if (nombre.trim().equals("miEgresosDiv")) {
            frmsys.showEgresosDiversos();
        } else if (nombre.trim().equals("miCierreProdDespachar")) {
            frmsys.showItemDespachar();
        } else if (nombre.trim().equals("m_ImportarAsiento")) {
            frmsys.showAsientoImportar();
        } else if (nombre.trim().equals("miImportarAsientoCaja")) {
            frmsys.showAsientoImportarCaja();
        } else if (nombre.trim().equals("miImportarAnexo")) {
            frmsys.showImportarAnexo();
        } else if (nombre.trim().equals("miImportaroC")) {
            frmsys.showImportarOc();
        } else if (nombre.trim().equals("miImportarTc")) {
            frmsys.showImportarTc();
        } else if (nombre.trim().equals("miImportarItem")) {
            frmsys.showImportarItem();
        } else if (nombre.trim().equals("m_libroVentasFormat14.1")) {
            frmsys.showRepLibroVentas();
        } else if (nombre.trim().equals("m_libroCompraFormat8.1")) {
            frmsys.showRepLibroCompras();
        } else if (nombre.trim().equals("m_libroDiarioFormat5.1")) {
            frmsys.showRepLibroDiario();
        } else if (nombre.trim().equals("m_libroDiarioFormat5.2")) {
            frmsys.showRepLibroDiarioSimp();
        } else if (nombre.trim().equals("m_libroMayorFormat6.1")) {
            frmsys.showRepLibroMayor();
        } else if (nombre.trim().equals("m_libroCajaBancoFormat1.1")) {
            frmsys.showRepLibroCajaBancos("caja");
        } else if (nombre.trim().equals("m_libroCajaBancoFormat1.2")) {
            frmsys.showRepLibroCajaBancos("banco");
        } else if (nombre.trim().equals("m_libroKardexFisico")) {
            frmsys.showRepKardexFisico();
        } else if (nombre.trim().equals("m_libroKardexValorado")) {
            frmsys.showRepKardexValorado();
        } else if (nombre.trim().equals("m_libroPercepVtas")) {
            frmsys.showRepLibroPercepcion();
        } else if (nombre.trim().equals("m_saldoCtaDocum")) {
            frmsys.showRepSaldoDocumento();
        } else if (nombre.trim().equals("m_analisisCtaResumido")) {
            frmsys.showRepAnalisisCtaResumido();
        } else if (nombre.trim().equals("miBalanceComp")) {
            frmsys.showBalanceComprobacion();
        } else if (nombre.trim().equals("m_cxcCliente")) {
            frmsys.showCuentasxCobrar();
        } else if (nombre.trim().equals("miDocumentosSunat")) {
            frmsys.showDocumentosSunat();
        } else if (nombre.trim().equals("miCxP")) {
            frmsys.showCuentasxPagar();
        } else if (nombre.trim().equals("miCxPupdate")) {
            frmsys.showCuentasxPagarUpdate();
        } else if (nombre.trim().equals("miSolEmitidas")) {
            frmsys.showReposicionCajaChica();
        } else if (nombre.trim().equals("miLiquidVtas")) {
            frmsys.showLiquidacionVentas();
        } else if (nombre.trim().equals("miRepFondoCCh")) {
            frmsys.showReposicionFondosCajaChica();
        } else if (nombre.trim().equals("m_libroInvBalance")) {
            frmsys.showRepLibroInvBalance();
        } else if (nombre.trim().equals("miPercepcionVenta")) {
            frmsys.showPercepcionVenta();
        } else if (nombre.trim().equals("mi_cierreCta6_9")) {
            frmsys.showPeriodoCuentaCierre("S");
        } else if (nombre.trim().equals("mi_cierreCta1_5")) {
            frmsys.showPeriodoCuentaCierre("N");
        } else if (nombre.trim().equals("miOrdenCompra")) {
            frmsys.showOrdenCompra();
        } else if (nombre.trim().equals("miFacturaCompras")) {
            frmsys.showFacturaCompra();
        } else if (nombre.trim().equals("miUbicacion")) {
            frmsys.showUbicacion();
        } else if (nombre.trim().equals("miNacionalidad")) {
            frmsys.showNacionalidad();
        }
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        if (e.getSource().equals(btn)) {
            if (btn.getIcon().equals(gif.UP)) {
                btn.setIcon(gif.DOWN);
            } else {
                btn.setIcon(gif.UP);
            }
            frmsys.cambiarToolbarSystem();
        }
    }
}


