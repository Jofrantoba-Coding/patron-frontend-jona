package com.softcommerce.views.uiregisternotacredito;

import com.softcommerce.views.uipaneltfnotacredito.UiPanelTFNotaCredito;


import com.softcommerce.formularios.*;
import com.softcommerce.beans.Localidad;
import com.softcommerce.beans.BeanMotivoNota;
import com.softcommerce.beans.BeanNcReporte;
import com.softcommerce.beans.PuntoVenta;
import com.softcommerce.beans.ContaCab;
import com.softcommerce.beans.Usuario;
import com.softcommerce.beans.UsuarioCorrelativo;
import com.softcommerce.beans.ContaItem;
import com.softcommerce.beans.Lote;
import com.softcommerce.comboboxmodel.ComboModelFormaPago;
import com.softcommerce.datasource.DataSourceNc;
import com.softcommerce.entity.RegcontaCab;
import com.softcommerce.enums.AuxiliarEnum;
import com.toedter.calendar.JDateChooser;
import com.toedter.calendar.JTextFieldDateEditor;
import com.softcommerce.general.controles.CComboBox;
import com.softcommerce.iconos.Gif;
import java.awt.Component;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.FocusEvent;
import java.awt.event.ItemEvent;
import java.awt.event.KeyEvent;
import javax.swing.BorderFactory;
import java.awt.Color;
import java.awt.Font;
import javax.swing.border.TitledBorder;
import java.util.Date;
import javax.swing.JButton;
import javax.swing.JComponent;
import javax.swing.JTextField;
import javax.swing.KeyStroke;
import javax.swing.SwingConstants;
import javax.swing.event.TableModelEvent;
import com.softcommerce.reglasnegocio.RnLocalidad;
import java.util.ArrayList;
import javax.swing.JFrame;
import javax.swing.JPanel;
import javax.swing.border.Border;
import com.softcommerce.general.controles.JHInternal;
import com.softcommerce.general.controles.CLabel;
import com.softcommerce.general.controles.CTable;
import com.softcommerce.general.herramientas.DateTime;
import com.softcommerce.general.controles.IntegerDocument;
import static com.softcommerce.general.controles.Register.INSERT;
import com.softcommerce.general.controles.UpperCaseNumberDocument;
import java.awt.Dimension;
import java.awt.Toolkit;
import java.awt.event.FocusListener;
import java.awt.event.ItemListener;
import java.util.List;
import javax.swing.JCheckBox;
import javax.swing.JLabel;
import javax.swing.JScrollPane;
import javax.swing.event.TableModelListener;
import com.softcommerce.general.tablas.NotaCreditoDescuentoTableModel;
import com.softcommerce.general.tablas.NotaCreditoDespachadoTableModel;
import com.softcommerce.reglasnegocio.rn_MotivoNotaCredito;
import com.softcommerce.reglasnegocio.RnPuntoVenta;
import com.softcommerce.reglasnegocio.RnCorrelativo;
import com.softcommerce.general.tablas.NotaCreditoPendienteTableModel;
import com.softcommerce.logic.LogicLote;
import com.softcommerce.logic.LogicRegContaCab;
import com.softcommerce.reglasnegocio.RnConsultas;
import com.softcommerce.reglasnegocio.RnRegContaCab;
import com.softcommerce.util.CompareDate;
import com.softcommerce.util.Constans;
import com.softcommerce.util.ExceptionHandler;
import com.softcommerce.util.Exportar;
import com.softcommerce.util.FEtxt;
import com.softcommerce.util.editor.CellEditorBtnLoteVenta;
import java.math.BigDecimal;
import java.util.Calendar;
import java.util.GregorianCalendar;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;
import javax.swing.JComboBox;
import javax.swing.JDialog;
import javax.swing.JOptionPane;
import net.sf.jasperreports.engine.JRParameter;
import org.apache.log4j.Logger;

public class UiRegisterNotaCredito
        extends JHInternal
        implements InterUiRegisterNotaCredito, ActionListener, FocusListener, ItemListener, TableModelListener {

    protected final Logger logger = Logger.getLogger(UiRegisterNotaCredito.class);
    protected CComboBox cboLocalidad;
    protected List<Localidad> xLocalidad;
    protected CComboBox cboTipoDocumento;
    protected CComboBox cboMotivoNota;
    protected List<BeanMotivoNota> xMotivoNota;
    protected CComboBox cboSerie;
    protected List<UsuarioCorrelativo> xSerie;
    protected CComboBox cboPuntoVenta;
    protected List<PuntoVenta> xPuntoVenta;
    protected JTextField txt_idregconta;
    protected JTextField txt_tmpanexo;
    protected JTextField txt_idanexo;
    protected JTextField txt_tmpruc;
    protected JTextField txt_noafecto;
    protected JTextField txt_descuento;
    protected JTextField txt_igv;
    protected JTextField txt_afecto;
    protected JTextField txt_total;
    protected JTextField txt_monto;
    protected JTextField txt_percepcion;
    protected JTextField txt_idregconta_ref;
    protected JTextField txt_idauxiliar;
    protected JTextField txt_tmpdireccion;
    protected JTextField txt_idestado;
    protected JTextField txt_idtipodoc;
    protected JTextField txt_glosa;
    protected JTextField txt_preimpreso;
    protected JTextField txt_preimpresoref;
    protected JTextField txt_idtipooperacion;
    protected JTextField txt_serieref;
    protected JTextField txt_idtipoanexo;
    protected JTextField txt_mes;
    protected JTextField txt_anio;
    protected JComboBox txt_idcondicionventa;
    protected JTextField txt_idmoneda;
    protected JDateChooser dc_fechainicio;
    protected JDateChooser dc_fechafin;
    protected JButton btn_buscar;
    protected final Usuario usuario;
    protected final JFrame frame;
    protected JCheckBox chk_seleccionar;
    protected JScrollPane scp_xdescuento;
    protected NotaCreditoDescuentoTableModel mdl_xdescuento;
    protected CTable tbl_xdescuento;
    protected JScrollPane scp_xdevolucionpendiente;
    protected NotaCreditoPendienteTableModel mdlDevolucionPendiente;
    protected CTable tblDevolucionPendiente;
    protected JScrollPane scp_xdevoluciondespachado;
    protected NotaCreditoDespachadoTableModel mdl_xdevoluciondespachado;
    protected CTable tbl_xdevoluciondespachado;
    protected final ComboModelFormaPago modelFormaPago = new ComboModelFormaPago();
    protected JLabel lblFechaVenc;
    protected java.util.Date fechaRef = new java.util.Date();
    protected RegcontaCab beanReferencia;
    protected JLabel lblMoneda;
    protected JTextField txtMoneda;
    protected JTextField txt_idtipo_doc_ref1;
    protected JTextField txt_serie_ref1;
    protected JTextField txt_preimpreso_ref1;
    protected JTextField txt_id_regconta_doc1;
    protected JTextField txt_id_anexo_ref;
    protected CLabel lblMonto;
    protected String userAutorizado;
    protected JTextField txt_id_vendedor;
    protected JTextField txt_id_movimiento;
    protected CellEditorBtnLoteVenta editorLote;
    protected JButton btnEditLote;

    public UiRegisterNotaCredito(UiPanelTFNotaCredito pnltfnotacredito, String title, Usuario usuario, JFrame frame) {
        super(title + " - UiRegisterNotaCredito");
        this.usuario = usuario;
        this.frame = frame;
        inicialize();
    }

    public void userAutorizado(String user) {
        userAutorizado = user;
    }

    protected void inicialize() {
    }
    ItemListener itemListener = new ItemListener() {
        @Override
        public void itemStateChanged(ItemEvent e) {
            if (txt_idcondicionventa.equals(e.getSource())) {
                try {
                    if (txt_idcondicionventa.getSelectedItem().toString().equalsIgnoreCase("CO")) {
                        dc_fechafin.setVisible(false);
                        lblFechaVenc.setVisible(false);
                    } else if (txt_idcondicionventa.getSelectedItem().toString().equalsIgnoreCase("CR")) {
                        dc_fechafin.setVisible(true);
                        lblFechaVenc.setVisible(true);
                    }
                } catch (Exception ex) {
                    dc_fechafin.setVisible(false);
                    lblFechaVenc.setVisible(false);
                }
            }
        }
    };

    @Override
    public void loadCombo() {
    }

    public void loadMovimiento() {
    }

    @Override
    public void newRegister() {
    }

    @Override
    public void focusGained(FocusEvent e) {
        if (e.getSource() == ((JTextFieldDateEditor) dc_fechainicio.getDateEditor())) {
            ((JTextFieldDateEditor) dc_fechainicio.getDateEditor()).selectAll();
        }

        if (e.getSource() == txt_preimpreso) {
            txt_preimpreso.selectAll();
        }

        if (e.getSource() == txt_serieref) {
            txt_serieref.selectAll();
        }

        if (e.getSource() == txt_preimpresoref) {
            txt_preimpresoref.selectAll();
        }

        if (e.getSource() == txt_glosa) {
            txt_glosa.selectAll();
        }
    }

    @Override
    public void focusLost(FocusEvent e) {
        if (e.getSource() == txt_preimpreso && txt_preimpreso.getText().trim().length() > 0) {
            String serie = "0000000000" + txt_preimpreso.getText().trim();
            String nuevaserie = serie.substring(serie.length() - 10, serie.length());
            txt_preimpreso.setText(nuevaserie);
        }
        if (e.getSource() == txt_preimpresoref && txt_preimpresoref.getText().trim().length() > 0) {
            String serie = "0000000000" + txt_preimpresoref.getText().trim();
            String nuevaserie = serie.substring(serie.length() - 10, serie.length());
            txt_preimpresoref.setText(nuevaserie);
        }

        if (e.getSource() == txt_glosa && txt_glosa.getText().trim().length() == 0) {
            txt_glosa.setText("GLOSA POR " + cboMotivoNota.getSelectedItem().toString());
        }
    }

    @Override
    public void setRegisterEditable(boolean e) {
        tblDevolucionPendiente.setColumnEditable(0, e);
        tblDevolucionPendiente.setColumnEditable(11, e);
        tbl_xdescuento.setColumnEditable(0, e);
        tbl_xdescuento.setColumnEditable(6, e);
        tbl_xdescuento.setColumnEditable(14, e);
        txt_preimpreso.setEditable(e);
        txt_serieref.setEditable(!e);
        txt_preimpresoref.setEditable(!e);
        txt_glosa.setEditable(e);
        if (Constans.ISBOTICA) {
            if (Constans.IS_LOTE_RESERVA) {
                tblDevolucionPendiente.getColumnModel().getColumn(11).setCellEditor(editorLote);
                tblDevolucionPendiente.getColumnModel().getColumn(11).setCellRenderer(editorLote);
            }
        }
    }

    @Override
    public void setRegisterEnabled(boolean e) {
        cboMotivoNota.setEnabled(e);
        cboSerie.setEnabled(e);
        cboTipoDocumento.setEnabled(e);
        btn_buscar.setEnabled(e);
        dc_fechainicio.setEnabled(e);
        chk_seleccionar.setEnabled(e);
    }

    @Override
    public boolean loadRegister() {
        return false;
    }

    public void setFormato(String cod) {
        boolean e = false;

        scp_xdevoluciondespachado.setVisible(cod.equals("001") ? !e : e);
        scp_xdescuento.setVisible(cod.equals("003") ? !e : e);
        scp_xdevolucionpendiente.setVisible(cod.equals("002") ? !e : e);
        chk_seleccionar.setVisible(cod.equals("001") ? e : !e);
        cboTipoDocumento.removeAllItems();
        if (cod.equals("001")) {
            cboTipoDocumento.addItem("NOTA DE INGRESO");
        } else {
            cboTipoDocumento.addItem("BOLETA DE VENTA");
            cboTipoDocumento.addItem("FACTURA");
        }

        newRegister();
    }

    @Override
    public void setValueSearch(Object valor, Component comp) {
    }

    protected void cargarDocumentoReferenciaDocumentoCambioPrecio2(ContaCab r) {
    }

    protected void setCondicionVenta(ContaCab regContaCab, Date fechaEmision, String msgFecha) {
    }

    protected void cargarDocumentoReferenciaDocumentoProductosEntregados(ContaCab r) {
    }

    public void mostrarPreimpreso() {
    }

    protected void cargarDocumentoReferenciaDocumentoProductosXEntregar(ContaCab r) {
    }

    protected List<ContaItem> getItemsPorVenta(ContaCab r) throws Exception {
        return null;
    }

    protected void setLotesItemReserva(List<ContaItem> listDetatle, String idRegconta) throws Exception {
    }

    protected ArrayList<Lote> getLotesBySecuencia(List<Lote> lotes, String idSecuencia) {
        ArrayList<Lote> result = new ArrayList();
        for (Lote lote : lotes) {
            if (lote.getIdSecuencia().equals(idSecuencia)) {
                result.add(lote);
            }
        }
        return result;
    }

    protected String getNameFile(String idTipoDoc, ContaCab beanRcc) {
        return this.usuario.getRuc() + "-" + idTipoDoc + "-" + beanRcc.getSerie() + "-" + beanRcc.getPreimpreso8Digs();
    }

    protected void exportarTxt(ContaCab beanRcc) {
    }

    @Override
    public String executeInsert() {
        return null;
    }

    protected Date getDateTime0(Date fecha) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(fecha);
        calendar.set(Calendar.MILLISECOND, 0);
        calendar.set(Calendar.SECOND, 0);
        calendar.set(Calendar.MINUTE, 0);
        calendar.set(Calendar.HOUR, 0);
        return calendar.getTime();
    }

    protected boolean validarFechas(java.util.Date fechaInicio, java.util.Date fechaFin) {
        return false;
    }

    protected void loadLocalidad(String xcodEmpres) {
    }

    protected void loadPuntoVenta(String xcodLocalidad) {
    }

    protected void loadSerieCorrelativo(String idTipoDoc) {
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        if (cboMotivoNota == e.getSource()) {
            if (cboMotivoNota.getItemCount() > 0) {
                setFormato(xMotivoNota.get(cboMotivoNota.getSelectedIndex()).getId_motivo());
            }
        }

        if (e.getSource() == btn_buscar) {
            //001 - DEV. DE PRODUCTOS ENTREGADOS
            if (xMotivoNota.get(cboMotivoNota.getSelectedIndex()).getId_motivo().equals("001")) {
                BuscarNCIngresoCliente a = new BuscarNCIngresoCliente(frame, this, usuario, path);
                a.cargarTabla(btn_buscar);
            }

            //002 - DEV. DE PRODUCTOS POR ENTREGAR
            if (xMotivoNota.get(cboMotivoNota.getSelectedIndex()).getId_motivo().equals("002")) {
                BuscarNCPendienteCliente a = new BuscarNCPendienteCliente(frame, this, usuario, path);
                a.cargarTabla(btn_buscar);
            }

            //003 - DEV. DE MERCADERIA POR CAMBIO DE PRECIO
            if (xMotivoNota.get(cboMotivoNota.getSelectedIndex()).getId_motivo().equals("003")) {
                BuscarNCDocumentosVenta a = new BuscarNCDocumentosVenta(frame, this, usuario, path);
                chk_seleccionar.setVisible(false);
                a.cargarTabla(btn_buscar);

            }
        }
        if (cboLocalidad == e.getSource()) {
            if (cboLocalidad.getItemCount() > 0) {
                if (cboLocalidad.getSelectedIndex() == 0) {
                    cboPuntoVenta.removeAllItems();
                } else {
                    loadPuntoVenta(xLocalidad.get(cboLocalidad.getSelectedIndex() - 1).getId_localidad());
                }
            }
        }

        if (cboSerie == e.getSource()) {
            if (cboSerie.getItemCount() > 0 && mode == INSERT) {
                mostrarPreimpreso();
            }
        }

    }

    public void cargarMotivoNotaCredito(String xcodiEmpresa) {
    }

    public void cargarLocalidad(String xcodiLocalidad) {
    }

    public void cargarPuntoVenta(String codPuntoVenta) {
    }

    @Override
    public void itemStateChanged(ItemEvent e) {
        editorLote.stopCellEditing();
        boolean isSelect;

        isSelect = (e.getStateChange() == ItemEvent.SELECTED);

        if (e.getItemSelectable() == chk_seleccionar) {
            if (xMotivoNota.get(cboMotivoNota.getSelectedIndex()).getId_motivo().equals("002")) {
                for (int i = 0; i < mdlDevolucionPendiente.getRowCount(); i++) {
                    mdlDevolucionPendiente.getVentaDirecta(i).setSeleccionado(isSelect);
                    mdlDevolucionPendiente.getVentaDirecta(i).setCant_a_devolver(mdlDevolucionPendiente.getVentaDirecta(i).isSeleccionado() == false ? "" : String.valueOf(mdlDevolucionPendiente.getVentaDirecta(i).getCant_pordespachar_cliente()).trim());
                    mdlDevolucionPendiente.getVentaDirecta(i).calcularMontos("C");
                }
                mdlDevolucionPendiente.fireTableDataChanged();
            }

            if (xMotivoNota.get(cboMotivoNota.getSelectedIndex()).getId_motivo().equals("003")) {
                for (int i = 0; i < mdl_xdescuento.getRowCount(); i++) {
                    mdl_xdescuento.getVentaDirecta(i).setSeleccionado(isSelect);
                    mdl_xdescuento.getVentaDirecta(i).setCant_a_devolver(mdl_xdescuento.getVentaDirecta(i).isSeleccionado() == false ? "" : String.valueOf(mdl_xdescuento.getVentaDirecta(i).getCantidad_string()).trim());
                    mdl_xdescuento.getVentaDirecta(i).setM_monto(mdl_xdescuento.getVentaDirecta(i).getCant_a_devolver().length() > 0 ? (Double.parseDouble(mdl_xdescuento.getVentaDirecta(i).getCant_a_devolver()) * mdl_xdescuento.getVentaDirecta(i).getP_unit()) : 0);
                    mdl_xdescuento.getVentaDirecta(i).setM_valor(mdl_xdescuento.getVentaDirecta(i).getAfecto_a_igv().equals("S") ? (mdl_xdescuento.getVentaDirecta(i).getM_monto() / (1 + mdl_xdescuento.getVentaDirecta(i).getP_igv())) : mdl_xdescuento.getVentaDirecta(i).getM_monto());
                    mdl_xdescuento.getVentaDirecta(i).setM_igv(mdl_xdescuento.getVentaDirecta(i).getAfecto_a_igv().equals("S") ? (mdl_xdescuento.getVentaDirecta(i).getM_monto() - mdl_xdescuento.getVentaDirecta(i).getM_valor()) : 0);
                    mdl_xdescuento.getVentaDirecta(i).setM_afecto(mdl_xdescuento.getVentaDirecta(i).getAfecto_a_igv().equals("S") ? (mdl_xdescuento.getVentaDirecta(i).getM_valor()) : 0);
                    mdl_xdescuento.getVentaDirecta(i).setM_noafecto(mdl_xdescuento.getVentaDirecta(i).getAfecto_a_igv().equals("S") ? (0) : mdl_xdescuento.getVentaDirecta(i).getM_valor());
                    mdl_xdescuento.getVentaDirecta(i).setM_percepcion(mdl_xdescuento.getVentaDirecta(i).getAfecto_percepcion().equals("S") ? (mdl_xdescuento.getVentaDirecta(i).getM_monto() * mdl_xdescuento.getVentaDirecta(i).getP_percepcion()) : 0);
                    mdl_xdescuento.getVentaDirecta(i).setM_total(mdl_xdescuento.getVentaDirecta(i).getM_monto() + mdl_xdescuento.getVentaDirecta(i).getM_percepcion());
                }

                mdl_xdescuento.fireTableDataChanged();
            }
        }
    }

    @Override
    public void tableChanged(TableModelEvent e) {
        if (mdl_xdescuento.getRowCount() > 0) {
            if (e.getSource() == mdl_xdescuento) {
                calcularImportesDescuento();
            }
        }

        if (mdlDevolucionPendiente.getRowCount() > 0) {
            if (e.getSource() == mdlDevolucionPendiente) {
                calcularImportesDevolucionPendiente();
            }
        }

        if (mdl_xdevoluciondespachado.getRowCount() > 0) {
            if (e.getSource() == mdl_xdevoluciondespachado) {
                calcularImportesDevolucionDespachado();
            }
        }
    }

    public void calcularImportesDescuento() {
    }

    public void calcularImportesDevolucionDespachado() {
    }

    public JDialog verDialogo() {
        JDialog dialogo = new JDialog();

        return dialogo;
    }

    public void calcularImportesDevolucionPendiente() {
    }

    @Override
    public boolean isRegisterValid() {
        return false;
    }

    @Override
    public void showMessagePrint(String codigo) {
    }

    @Override
    public boolean executeDelete() {
        return false;
    }

    @Override
    public boolean executeAnular() {
        return false;
    }

    @Override
    public void showMessageSuccessfulInsert() {
    }

    @Override
    public void showMessageSuccessfulUpdate() {
    }

    @Override
    public void showMessageSuccessfulDelete() {
    }

    @Override
    public void showMessageErrorDelete() {
    }

    @Override
    public void showMessageErrorUpdate() {
    }

    @Override
    public void showMessageErrorInsert() {
    }

    @Override
    public String executeUpdate() {
        return null;
    }

    @Override
    public boolean executeSelect() {
        return false;
    }

    @Override
    public void onPressEsc() {
    }

    public JButton getBtnEditLote() {
        return btnEditLote;
    }

}

