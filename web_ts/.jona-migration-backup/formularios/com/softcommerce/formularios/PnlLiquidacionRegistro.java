package com.softcommerce.formularios;

import com.softcommerce.beans.BeanCajaSerie;
import com.softcommerce.beans.ContaDet;
import com.softcommerce.beans.Liquidacion;
import com.softcommerce.beans.BeanParametro;
import com.softcommerce.beans.BeanTipoCambio;
import com.softcommerce.beans.RegContaCab;
import com.softcommerce.beans.Usuario;
import com.softcommerce.beans.UsuarioCorrelativo;
import com.softcommerce.general.controles.CuadroMensaje;
import com.softcommerce.general.controles.ItemObject;
import com.softcommerce.reglasnegocio.RnCajaSerie;
import com.softcommerce.reglasnegocio.RnCorrelativo;
import javax.swing.JPanel;
import java.awt.Color;

import javax.swing.BorderFactory;
import javax.swing.JButton;
import javax.swing.border.TitledBorder;

import java.awt.Font;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.ItemEvent;
import java.awt.event.ItemListener;
import java.awt.event.KeyAdapter;
import java.awt.event.KeyEvent;
import java.math.BigDecimal;
import java.text.NumberFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import javax.swing.JLabel;
import javax.swing.JTextField;
import javax.swing.ImageIcon;

import org.jdesktop.swingx.JXDatePicker;

import javax.swing.JScrollPane;
import javax.swing.SwingConstants;
import javax.swing.JComboBox;
import javax.swing.JDialog;
import javax.swing.JFormattedTextField;
import javax.swing.JOptionPane;
import javax.swing.text.DefaultFormatterFactory;
import javax.swing.text.NumberFormatter;
import com.softcommerce.reglasnegocio.RnLiquidacion;
import com.softcommerce.reglasnegocio.RnTipoCambio;
import com.softcommerce.reglasnegocio.RnUsuario;
import com.softcommerce.report.reporte_v3;
import com.softcommerce.tablemodel.TableModelDocumentoSinLiquidar;
import com.softcommerce.util.Constans;
import com.softcommerce.util.ExceptionHandler;
import com.softcommerce.util.Util;
import com.softcommerce.util.render.CellRenderer;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.Map;
import java.util.Set;
import javax.swing.JTable;
import javax.swing.ListSelectionModel;
import java.net.URL;
import org.apache.log4j.Logger;

public class PnlLiquidacionRegistro
        extends JDialog {

    private JPanel pnlBusqueda;
    private JLabel lblVendedor;
    private JLabel lblFecha;
    private JXDatePicker dtpFecha;
    private JButton btnBuscar;
    private JScrollPane scrollPane;
    private JTable table;
    private TableModelDocumentoSinLiquidar modelSinLiquidar;
    private JFormattedTextField txtTotal;
    private JFormattedTextField txtTotalCredito;
    private JLabel lblTotal;
    private JLabel lblTotalCredito;
    private JFormattedTextField txtIGV;
    private JFormattedTextField txtIGVCredito;
    private JLabel lblIgv;
    private JLabel lblIgvCredito;
    private JFormattedTextField txtSubTotal;
    private JFormattedTextField txtSubTotalCredito;
    private JLabel lblSubTotal;
    private JLabel lblSubTotalCredito;
    private JComboBox cboVendedor;
    private JButton btnLiquidar;
    private JLabel lblNLiquidacion;
    private JComboBox cboLiqSerie;
    private JTextField txtLiqNumero;
    private JFormattedTextField txtTipoCambio;
    private JLabel lblTipoCambio;
    private final URL path;
    private CuadroMensaje cuadro;
    private final Usuario usuario;
    private DefaultFormatterFactory currFactory;
    private BigDecimal TipoCambio = null;
    private String Id_Cuenta = "";
    private boolean swAceptar = false;
    private final Logger logger = Logger.getLogger(PnlLiquidacionRegistro.class);

    public PnlLiquidacionRegistro(URL path, Usuario user, Main frm) {
        super(frm, true);
        this.path = path;
        this.usuario = user;
        this.inicialice();
    }

    private void inicialice() {
        setBounds(50, 50, 835, 520);
        setModal(true);
        cuadro = new CuadroMensaje(this.usuario);
        NumberFormat dispFormat = NumberFormat.getNumberInstance(Locale.US);
        NumberFormatter dnFormat = new NumberFormatter(dispFormat);
        currFactory = new DefaultFormatterFactory(dnFormat, dnFormat);

        setLayout(null);
        add(getPnlBusqueda());
        add(getScrollPane());
        add(getTxtTotal());
        add(getTxtTotalCredito());
        add(getLblTotal());
        add(getLblTotalCredito());
        add(getTxtIGV());
        add(getTxtIGVCredito());
        add(getLblIgv());
        add(getLblIgvCredito());
        add(getTxtSubTotal());
        add(getTxtSubTotalCredito());
        add(getLblSubTotal());
        add(getLblSubTotalCredito());
        add(getBtnLiquidar());
        add(getLblNLiquidacion());
        add(getCboLiqSerie());
        add(getTxtLiqNumero());
        add(getTxtTipoCambio());
        add(getLblTipoCambio());

        retornaCorrelativoxUsuario(this.usuario.getId_usuario(), this.usuario.getCodpuntoventa(), "LC");
        TipoCambio = retornaTipoCambio();
        getTxtTipoCambio().setValue(TipoCambio);

        getCboVendedor().transferFocus();
    }

    private JButton getBtnLiquidar() {
        if (btnLiquidar == null) {
            btnLiquidar = new JButton("liquidar");
            btnLiquidar.setFont(new Font("Tahoma", Font.PLAIN, 11));
            btnLiquidar.setIcon(new ImageIcon(PnlLiquidacionRegistro.class.getResource("/com/softcommerce/iconos/calculadora2.png")));
            btnLiquidar.setBounds(706, 445, 100, 22);
            btnLiquidar.addKeyListener(new KeyAdapter() {
                @Override
                public void keyPressed(KeyEvent arg0) {
                    liquidar();
                }
            });
            btnLiquidar.addActionListener(new ActionListener() {
                @Override
                public void actionPerformed(ActionEvent arg0) {
                    liquidar();
                }
            });
        }
        return btnLiquidar;
    }

    private JFormattedTextField getTxtTotal() {
        if (txtTotal == null) {
            txtTotal = new JFormattedTextField();
            txtTotal.setFont(new Font("Tahoma", Font.PLAIN, 11));
            txtTotal.setBounds(706, 385, 100, 22);
            txtTotal.setColumns(10);
            txtTotal.setHorizontalAlignment(SwingConstants.RIGHT);
            txtTotal.setEditable(false);
            txtTotal.setFormatterFactory(currFactory);
        }
        return txtTotal;
    }

    private JFormattedTextField getTxtTotalCredito() {
        if (txtTotalCredito == null) {
            txtTotalCredito = new JFormattedTextField();
            txtTotalCredito.setFont(new Font("Tahoma", Font.PLAIN, 11));
            txtTotalCredito.setBounds(706, 415, 100, 22);
            txtTotalCredito.setColumns(10);
            txtTotalCredito.setHorizontalAlignment(SwingConstants.RIGHT);
            txtTotalCredito.setEditable(false);
            txtTotalCredito.setFormatterFactory(currFactory);
        }
        return txtTotalCredito;
    }

    private JLabel getLblTotal() {
        if (lblTotal == null) {
            lblTotal = new JLabel("Total Efec");
            lblTotal.setHorizontalAlignment(SwingConstants.RIGHT);
            lblTotal.setFont(new Font("Tahoma", Font.PLAIN, 11));
            lblTotal.setBounds(630, 385, 70, 22);
        }
        return lblTotal;
    }

    private JLabel getLblTotalCredito() {
        if (lblTotalCredito == null) {
            lblTotalCredito = new JLabel("Total Cred");
            lblTotalCredito.setHorizontalAlignment(SwingConstants.RIGHT);
            lblTotalCredito.setFont(new Font("Tahoma", Font.PLAIN, 11));
            lblTotalCredito.setBounds(630, 415, 70, 22);
        }
        return lblTotalCredito;
    }

    private JFormattedTextField getTxtIGV() {
        if (txtIGV == null) {
            txtIGV = new JFormattedTextField();
            txtIGV.setFont(new Font("Tahoma", Font.PLAIN, 11));
            txtIGV.setBounds(537, 385, 100, 22);
            txtIGV.setColumns(10);
            txtIGV.setEditable(false);
            txtIGV.setFormatterFactory(currFactory);
            txtIGV.setHorizontalAlignment(SwingConstants.RIGHT);
        }
        return txtIGV;
    }

    private JFormattedTextField getTxtIGVCredito() {
        if (txtIGVCredito == null) {
            txtIGVCredito = new JFormattedTextField();
            txtIGVCredito.setFont(new Font("Tahoma", Font.PLAIN, 11));
            txtIGVCredito.setBounds(537, 415, 100, 22);
            txtIGVCredito.setColumns(10);
            txtIGVCredito.setEditable(false);
            txtIGVCredito.setFormatterFactory(currFactory);
            txtIGVCredito.setHorizontalAlignment(SwingConstants.RIGHT);
        }
        return txtIGVCredito;
    }

    private JLabel getLblIgv() {
        if (lblIgv == null) {
            lblIgv = new JLabel("Per Efec");
            lblIgv.setHorizontalAlignment(SwingConstants.RIGHT);
            lblIgv.setFont(new Font("Tahoma", Font.PLAIN, 11));
            lblIgv.setBounds(460, 385, 70, 22);
        }
        return lblIgv;
    }

    private JLabel getLblIgvCredito() {
        if (lblIgvCredito == null) {
            lblIgvCredito = new JLabel("Per Cred");
            lblIgvCredito.setHorizontalAlignment(SwingConstants.RIGHT);
            lblIgvCredito.setFont(new Font("Tahoma", Font.PLAIN, 11));
            lblIgvCredito.setBounds(460, 415, 70, 22);
        }
        return lblIgvCredito;
    }

    private JFormattedTextField getTxtSubTotal() {
        if (txtSubTotal == null) {
            txtSubTotal = new JFormattedTextField();
            txtSubTotal.setFont(new Font("Tahoma", Font.PLAIN, 11));
            txtSubTotal.setBounds(376, 385, 100, 22);
            txtSubTotal.setColumns(10);
            txtSubTotal.setEditable(false);
            txtSubTotal.setFormatterFactory(currFactory);
            txtSubTotal.setHorizontalAlignment(SwingConstants.RIGHT);
        }
        return txtSubTotal;
    }

    private JFormattedTextField getTxtSubTotalCredito() {
        if (txtSubTotalCredito == null) {
            txtSubTotalCredito = new JFormattedTextField();
            txtSubTotalCredito.setFont(new Font("Tahoma", Font.PLAIN, 11));
            txtSubTotalCredito.setBounds(376, 415, 100, 22);
            txtSubTotalCredito.setColumns(10);
            txtSubTotalCredito.setEditable(false);
            txtSubTotalCredito.setFormatterFactory(currFactory);
            txtSubTotalCredito.setHorizontalAlignment(SwingConstants.RIGHT);
        }
        return txtSubTotalCredito;
    }

    private JLabel getLblSubTotal() {
        if (lblSubTotal == null) {
            lblSubTotal = new JLabel("Sub Total Efec.");
            lblSubTotal.setFont(new Font("Tahoma", Font.PLAIN, 11));
            lblSubTotal.setBounds(280, 385, 100, 22);
        }
        return lblSubTotal;
    }

    private JLabel getLblSubTotalCredito() {
        if (lblSubTotalCredito == null) {
            lblSubTotalCredito = new JLabel("Sub Total Cred.");
            lblSubTotalCredito.setFont(new Font("Tahoma", Font.PLAIN, 11));
            lblSubTotalCredito.setBounds(280, 415, 100, 22);
        }
        return lblSubTotalCredito;
    }

    private JTable getTable() {
        if (table == null) {
            modelSinLiquidar = new TableModelDocumentoSinLiquidar();
            table = new JTable();
            table.setModel(modelSinLiquidar);
            table.setAutoCreateRowSorter(true);
            table.setCellSelectionEnabled(true);
            table.setSelectionMode(ListSelectionModel.MULTIPLE_INTERVAL_SELECTION);
            inicializaTable();
        }
        return table;
    }

    private JPanel getPnlBusqueda() {
        if (pnlBusqueda == null) {
            pnlBusqueda = new JPanel();
            pnlBusqueda.setBounds(10, 32, 800, 60);
            pnlBusqueda.setBorder(BorderFactory.createTitledBorder(null, "Buscar por:", TitledBorder.DEFAULT_JUSTIFICATION, TitledBorder.DEFAULT_POSITION, new Font("Tahoma", Font.PLAIN, 11), new Color(51, 51, 51)));
            pnlBusqueda.setLayout(null);
            pnlBusqueda.add(getLblVendedor());
            pnlBusqueda.add(getCboVendedor());
            pnlBusqueda.add(getLblFecha());
            pnlBusqueda.add(getDtpFecha());
            pnlBusqueda.add(getBtnBuscar());
        }
        return pnlBusqueda;
    }

    private JLabel getLblVendedor() {
        if (lblVendedor == null) {
            lblVendedor = new JLabel("Vendedor:");
            lblVendedor.setBounds(10, 25, 60, 22);
            lblVendedor.setFont(new Font("Tahoma", Font.PLAIN, 11));
        }
        return lblVendedor;
    }

    private JLabel getLblFecha() {
        if (lblFecha == null) {
            lblFecha = new JLabel("Fecha:");
            lblFecha.setBounds(330, 25, 40, 22);
            lblFecha.setFont(new Font("Tahoma", Font.PLAIN, 11));
        }
        return lblFecha;
    }

    private JXDatePicker getDtpFecha() {
        if (dtpFecha == null) {
            dtpFecha = new JXDatePicker();
            dtpFecha.setFont(new Font("Tahoma", Font.PLAIN, 11));
            dtpFecha.setBounds(375, 25, 120, 22);
            dtpFecha.setFormats("dd/MM/yyyy");
            dtpFecha.setDate(new Date());
            dtpFecha.getEditor().addKeyListener(new KeyAdapter() {
                @Override
                public void keyPressed(KeyEvent e) {
                    if (e.getKeyCode() == KeyEvent.VK_ENTER) {
                        dtpFecha.getEditor().transferFocus();
                    }
                }
            });
        }
        return dtpFecha;
    }

    private void buscarLiquidacion() {
        String serie = ((String) cboLiqSerie.getSelectedItem()).trim();
        ItemObject itT = (ItemObject) getCboVendedor().getSelectedItem();

        if (serie.length() > 0) {
            listaBuscaDocumentoSinLiquidar(serie, itT.getId(), usuario.getCodpuntoventa(), getDtpFecha().getDate());
        } else {
            cuadro.CuadroAviso("Debe seleccionar una serie", JOptionPane.WARNING_MESSAGE);
            List<RegContaCab> lista = new ArrayList();
            modelSinLiquidar.setData(lista);
            modelSinLiquidar.fireTableDataChanged();
            calculaTotales();
        }
    }

    private JButton getBtnBuscar() {
        if (btnBuscar == null) {
            btnBuscar = new JButton("Buscar");
            btnBuscar.setFont(new Font("Tahoma", Font.PLAIN, 11));
            btnBuscar.setIcon(new ImageIcon(PnlLiquidacionRegistro.class.getResource("/com/softcommerce/iconos/search.png")));
            btnBuscar.setBounds(505, 25, 100, 22);
            btnBuscar.addKeyListener(new KeyAdapter() {
                @Override
                public void keyPressed(KeyEvent e) {
                    if (e.getKeyCode() == KeyEvent.VK_ENTER) {
                        buscarLiquidacion();
                    }
                }
            });
            btnBuscar.addActionListener(new ActionListener() {
                @Override
                public void actionPerformed(ActionEvent arg0) {
                    buscarLiquidacion();
                }
            });
        }
        return btnBuscar;
    }

    private JScrollPane getScrollPane() {
        if (scrollPane == null) {
            scrollPane = new JScrollPane();
            scrollPane.setBounds(10, 100, 800, 280);
            scrollPane.setViewportView(getTable());
        }
        return scrollPane;
    }

    private void inicializaTable() {
        getTable().getColumnModel().getColumn(3).setPreferredWidth(250);
        getTable().getColumnModel().getColumn(1).setPreferredWidth(25);
        getTable().getColumnModel().getColumn(0).setPreferredWidth(25);
        CellRenderer CellRenderer = new CellRenderer();
        getTable().setDefaultRenderer(String.class, CellRenderer);
        getTable().setDefaultRenderer(BigDecimal.class, CellRenderer);
    }

    private JLabel getLblNLiquidacion() {
        if (lblNLiquidacion == null) {
            lblNLiquidacion = new JLabel("Liquidacion:");
            lblNLiquidacion.setBounds(605, 4, 62, 22);
            lblNLiquidacion.setFont(new Font("Tahoma", Font.PLAIN, 11));
        }
        return lblNLiquidacion;
    }

    public void mostrarPreimpreso() {
        try {
            UsuarioCorrelativo uc = new UsuarioCorrelativo();
            uc.setIdPuntoVenta(usuario.getCodpuntoventa());
            uc.setIdTipoDoc("LC");
            uc.setIdUsuario(usuario.getId_usuario());
            uc.setSerie(xserie.get(cboLiqSerie.getSelectedIndex()).getSerie());

            RnCorrelativo logic = new RnCorrelativo(path);
            String seriePreimpreso = logic.listarPreimpreso(xserie.get(cboLiqSerie.getSelectedIndex()).getIdCorrelativo());
            txtLiqNumero.setText(Util.getPreimpresoValue(seriePreimpreso));
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    private JComboBox getCboLiqSerie() {
        if (cboLiqSerie == null) {
            cboLiqSerie = new JComboBox();
            cboLiqSerie.addItemListener(new ItemListener() {
                @Override
                public void itemStateChanged(ItemEvent arg0) {
                    if (cboLiqSerie.getItemCount() > 0) {
                        mostrarPreimpreso();
                        verificaExisteCuenta(xserie.get(cboLiqSerie.getSelectedIndex()).getSerie());
                        modelSinLiquidar.getData().clear();
                        modelSinLiquidar.fireTableDataChanged();
                        limpiaControles();
                    }
                }
            });
            cboLiqSerie.addKeyListener(new KeyAdapter() {
                @Override
                public void keyPressed(KeyEvent arg0) {
                    cboLiqSerie.transferFocus();
                }
            });
            cboLiqSerie.setBounds(670, 4, 60, 22);
            cboLiqSerie.setEditable(false);
            cboLiqSerie.setFont(new Font("Tahoma", Font.PLAIN, 11));
        }
        return cboLiqSerie;
    }

    private JTextField getTxtLiqNumero() {
        if (txtLiqNumero == null) {
            txtLiqNumero = new JTextField();
            txtLiqNumero.addKeyListener(new KeyAdapter() {
                @Override
                public void keyPressed(KeyEvent e) {
                    txtLiqNumero.transferFocus();
                }
            });
            txtLiqNumero.setBounds(727, 4, 80, 22);
            txtLiqNumero.setEditable(false);
            txtLiqNumero.setFont(new Font("Tahoma", Font.PLAIN, 11));
            txtLiqNumero.setHorizontalAlignment(SwingConstants.RIGHT);
            txtLiqNumero.setColumns(10);
        }
        return txtLiqNumero;
    }

    private JComboBox getCboVendedor() {
        if (cboVendedor == null) {
            cboVendedor = new JComboBox();
            cboVendedor.setFont(new Font("Tahoma", Font.PLAIN, 11));
            cboVendedor.setBounds(75, 25, 245, 22);
            cboVendedor.setEnabled(false);
            listaUsuarioTrabajador(usuario.getCodempresa(), usuario.getId_trabajador());
        }
        return cboVendedor;
    }

    private JFormattedTextField getTxtTipoCambio() {
        if (txtTipoCambio == null) {
            txtTipoCambio = new JFormattedTextField();
            txtTipoCambio.setEnabled(false);
            txtTipoCambio.setHorizontalAlignment(SwingConstants.RIGHT);
            txtTipoCambio.setFont(new Font("Tahoma", Font.PLAIN, 11));
            txtTipoCambio.setBounds(529, 4, 60, 22);
            txtTipoCambio.setColumns(10);
        }
        return txtTipoCambio;
    }

    private JLabel getLblTipoCambio() {
        if (lblTipoCambio == null) {
            lblTipoCambio = new JLabel("Tipo Cambio:");
            lblTipoCambio.setFont(new Font("Tahoma", Font.PLAIN, 11));
            lblTipoCambio.setBounds(454, 4, 70, 22);
        }
        return lblTipoCambio;
    }

    private void listaUsuarioTrabajador(String xEmpresa, String xUsuario) {
        try {
            RnUsuario obj = new RnUsuario(path);
            List<Usuario> user = obj.ListaUsuarioTrabajador(xEmpresa);

            getCboVendedor().removeAllItems();
            getCboVendedor().addItem(new ItemObject("0", "------- NINGUNO -----"));
            for (int i = 0; i < user.size(); i++) {
                getCboVendedor().addItem(new ItemObject(user.get(i).getId_trabajador(), user.get(i).getTrabajador()));
            }
            for (int i = 0; i < getCboVendedor().getItemCount(); i++) {
                ItemObject it = (ItemObject) getCboVendedor().getItemAt(i);
                if (it.getId().trim().equals(xUsuario.trim()) == true) {
                    getCboVendedor().setSelectedIndex(i);
                }
            }
        } catch (Exception ex) {
            cuadro.CuadroAviso("Error al cargar datos del personal: " + ex.getMessage(), JOptionPane.ERROR_MESSAGE);
        }
    }

    public void listaBuscaDocumentoSinLiquidar(String serie, String id_trabajador, String id_punto_venta, Date f_emision) {
        try {
            RnLiquidacion obj = new RnLiquidacion(path);
            List<RegContaCab> lista = obj.BuscaDocumentoSinLiquidacion(serie, id_trabajador, id_punto_venta, f_emision);

            inicializaTable();
            if (lista.isEmpty()) {
                cuadro.CuadroAviso("No se encontraron documentos", JOptionPane.PLAIN_MESSAGE);
                modelSinLiquidar.setData(lista);
                modelSinLiquidar.fireTableDataChanged();
                calculaTotales();
            } else {
                modelSinLiquidar.setData(lista);
                modelSinLiquidar.fireTableDataChanged();
                calculaTotales();
            }
        } catch (Exception ex) {
            cuadro.CuadroAviso("Error al buscar documento", JOptionPane.ERROR_MESSAGE);
            ExceptionHandler.handleException(ex, logger);
        }
    }

    private void calculaTotales() {
        BigDecimal subtotal = BigDecimal.ZERO, igv = BigDecimal.ZERO, total = BigDecimal.ZERO;
        BigDecimal subtotalCredito = BigDecimal.ZERO, igvCredito = BigDecimal.ZERO, totalCredito = BigDecimal.ZERO;
        Iterator<RegContaCab> i = modelSinLiquidar.getData().iterator();
        while (i.hasNext()) {
            RegContaCab reg = i.next();
            if (reg.getTipoCondicion().equalsIgnoreCase("CO")) {
                subtotal = subtotal.add(reg.getM_monto());
                igv = igv.add(reg.getM_percepcion());
                total = total.add(reg.getM_monto().add(reg.getM_percepcion()));
            } else if (reg.getTipoCondicion().equalsIgnoreCase("CR")) {
                subtotalCredito = subtotalCredito.add(reg.getM_monto());
                igvCredito = igvCredito.add(reg.getM_percepcion());
                totalCredito = totalCredito.add(reg.getM_monto().add(reg.getM_percepcion()));
            }
        }
        getTxtSubTotal().setValue(subtotal);
        getTxtIGV().setValue(igv);
        getTxtTotal().setValue(total);
        getTxtSubTotalCredito().setValue(subtotalCredito);
        getTxtIGVCredito().setValue(igvCredito);
        getTxtTotalCredito().setValue(totalCredito);
    }

    private boolean permiteLiquidacion(String id_trabajador, String id_punto_venta, String Serie, String Preimpreso, Date f_inicio, Date f_fin) {
        try {
            RnLiquidacion obj = new RnLiquidacion(path);
            List<Liquidacion> lista = obj.PermiteLiquidacion(id_trabajador, id_punto_venta, Serie, Preimpreso, f_inicio, f_fin);
            return lista.isEmpty();
        } catch (Exception ex) {
            cuadro.CuadroAviso("Error al realizar busqueda: " + ex.getMessage(), JOptionPane.ERROR_MESSAGE);
            return false;
        }
    }

    private boolean validaFormulario() {
        try {
            boolean blnResultado;
            ItemObject it = (ItemObject) getCboVendedor().getSelectedItem();
            String serie = ((String) cboLiqSerie.getSelectedItem()).trim();
            blnResultado = permiteLiquidacion(it.getId(), usuario.getCodpuntoventa(), serie, "", getDtpFecha().getDate(), getDtpFecha().getDate());

            if (Id_Cuenta.isEmpty()) {
                cuadro.CuadroAviso("No existe una cuenta relacionada a esta serie", JOptionPane.PLAIN_MESSAGE);
                return false;
            }

            if (!blnResultado) {
                cuadro.CuadroAviso("Ya hizo una liquidaciÃ³n esa fecha", JOptionPane.PLAIN_MESSAGE);
                return false;
            }

            if (getTxtLiqNumero().getText().isEmpty() || getCboLiqSerie().getItemCount() == 0) {
                cuadro.CuadroAviso("No se encontrÃ³ nÃºmero correlativo", JOptionPane.PLAIN_MESSAGE);
                return false;
            }

            if (getTable().getRowCount() == 0) {
                cuadro.CuadroAviso("No se encontraron documentos para liquidar", JOptionPane.PLAIN_MESSAGE);
                return false;
            }

            if (serie.length() == 0) {
                cuadro.CuadroAviso("No se encontraron documentos por liquidar", JOptionPane.PLAIN_MESSAGE);
                return false;
            }

            if (!verificaCorrelativo()) {
                cuadro.CuadroAviso("Los correlativos no son continuos", JOptionPane.PLAIN_MESSAGE);
                return false;
            }
            return true;
        } catch (Exception ex) {
            cuadro.CuadroAviso("Error al validar el formulario", JOptionPane.ERROR_MESSAGE);
            ExceptionHandler.handleException(ex, logger);
            return false;
        }
    }

    List<UsuarioCorrelativo> xserie;

    private void retornaCorrelativoxUsuario(String xIdUsuario, String xIdPuntoVenta, String xIdTipoDoc) {
        try {
            RnCorrelativo regla_correlativo = new RnCorrelativo(path);
            List<UsuarioCorrelativo> correlativo = regla_correlativo.listarCorrelativo(xIdUsuario, xIdPuntoVenta, xIdTipoDoc);
            xserie = correlativo;
            getCboLiqSerie().removeAllItems();
            getCboLiqSerie().addItem(new ItemObject("0", ""));
            if (correlativo.isEmpty() == true) {
                cuadro.CuadroAviso("No se encontraron correlativos relacionados", JOptionPane.PLAIN_MESSAGE);
                getTxtLiqNumero().setText("");
                getBtnLiquidar().setEnabled(false);
            } else {
                cboLiqSerie.removeAllItems();
                for (int j = 0; j < xserie.size(); j++) {
                    cboLiqSerie.addItem(xserie.get(j).getSerie());
                }

                if (cboLiqSerie.getItemCount() > 0) {
                    cboLiqSerie.setSelectedIndex(0);
                }
                getBtnLiquidar().setEnabled(true);
                mostrarPreimpreso();
            }
        } catch (Exception ex) {
            cuadro.CuadroAviso("Error al cargar los correlativos", JOptionPane.ERROR_MESSAGE);
            ExceptionHandler.handleException(ex, logger);
        }
    }

    @SuppressWarnings("deprecation")
    private void liquidar() {
        if (!validaFormulario()) {
            return;
        }
        ItemObject itTra = (ItemObject) this.getCboVendedor().getSelectedItem();
        String id_Tipo_Anexo = "2";
        String id_Moneda = "00001";
        String id_Tipo_Doc = "LC";
        String id_Estado = "005";
        String id_Auxiliar = "00010";
        BigDecimal monto = BigDecimal.valueOf(Double.parseDouble(getTxtTotal().getValue().toString()));
        java.text.SimpleDateFormat sda = new java.text.SimpleDateFormat("yyyy");
        String anio = sda.format(getDtpFecha().getDate());

        java.text.SimpleDateFormat sdm = new java.text.SimpleDateFormat("MM");
        String mes = sdm.format(getDtpFecha().getDate());

        List<ContaDet> detalle = new ArrayList();
        Iterator<RegContaCab> i = modelSinLiquidar.getData().iterator();
        while (i.hasNext()) {
            RegContaCab reg = i.next();
            if (reg.getTipoCondicion().equalsIgnoreCase("CO") || reg.getTipoCondicion().equalsIgnoreCase("TA")) {
                ContaDet c = new ContaDet();
                c.setIdCondicionVenta(reg.getId_condicion_venta());
                c.setIdTipoPago(reg.getIdTipoPago());
                c.setTipoCondicion(reg.getTipoCondicion());
                c.setFechaDoc(reg.getF_emision());
                if (reg.getTipoCondicion().equalsIgnoreCase("CO")) {
                    c.setId_cuenta(Id_Cuenta);
                } else if (reg.getTipoCondicion().equalsIgnoreCase("TA")) {
                    c.setId_cuenta(reg.getCuentaContable());
                }
                c.setId_empresa(usuario.getCodempresa());
                c.setAnio(anio);
                c.setMes(mes);
                if (reg.getId_tipo_doc().trim().equalsIgnoreCase("07")) {
                    c.setHaber(Double.valueOf(reg.getM_monto().toString()) * -1);
                    c.setId_tipo_movc(2);
                    c.setDebe(0);
                } else {
                    c.setDebe(Double.valueOf(reg.getM_monto().toString()));
                    c.setId_tipo_movc(1);
                    c.setHaber(0);
                }
                c.setId_tipo_doc(reg.getId_tipo_doc());
                c.setSerie(reg.getSerie());
                c.setPreimpreso(reg.getPreimpreso());
                c.setId_tipoanexo("2");
                c.setId_anexo(reg.getId_anexo());
                if (reg.getTmp_anexo() != null) {
                    c.setNombre(reg.getTmp_anexo());
                } else {
                    c.setNombre(reg.getTmp_anexo_ref());
                }
                c.setFecha(getDtpFecha().getDate());
                c.setId_usuario(usuario.getId_usuario());
                c.setGlosa("Liquidacion " + getDtpFecha().getDate() + " " + usuario.getNombre());
                c.setId_auxiliar("00010");
                c.setTipo_detalle("M");
                c.setTipo_cambio(TipoCambio.doubleValue());
                c.setId_regconta_doc(reg.getId_regconta());
                c.setId_cuenta_ref(reg.getCuentaContado());
                c.setId_tipo_doc_ref(reg.getId_tipo_doc());
                c.setSerie_ref(reg.getSerie());
                c.setPreimpreso_ref(reg.getPreimpreso());
                detalle.add(c);

                ContaDet c12 = new ContaDet();
                c12.setIdCondicionVenta(reg.getId_condicion_venta());
                c12.setIdTipoPago(reg.getIdTipoPago());
                c12.setTipoCondicion(reg.getTipoCondicion());
                c12.setId_cuenta(reg.getCuentaContado());
                c12.setId_empresa(usuario.getCodempresa());
                c12.setAnio(anio);
                c12.setMes(mes);
                System.out.println("Afecto: " + reg.getM_monto() + ", Percepcion: " + reg.getM_percepcion());
                if (reg.getId_tipo_doc().trim().equalsIgnoreCase("07")) {
                    c12.setHaber(0);
                    c12.setDebe(reg.getM_monto().doubleValue() * -1);
                } else {
                    c12.setDebe(0);
                    c12.setHaber(reg.getM_monto().doubleValue());
                }
                c12.setId_tipo_doc(reg.getId_tipo_doc());
                c12.setSerie(reg.getSerie());
                c12.setPreimpreso(reg.getPreimpreso());
                c12.setId_tipoanexo("2");
                c12.setId_anexo(reg.getId_anexo());
                if (reg.getTmp_anexo() != null) {
                    c12.setNombre(reg.getTmp_anexo());
                } else {
                    c12.setNombre(reg.getTmp_anexo_ref());
                }

                c12.setFecha(getDtpFecha().getDate());
                c12.setId_usuario(usuario.getId_usuario());
                c12.setGlosa("Liquidacion " + getDtpFecha().getDate() + " " + usuario.getNombre());
                c12.setId_auxiliar("00010");
                c12.setTipo_detalle("M");
                c12.setFechaDoc(reg.getF_emision());
                c12.setTipo_cambio(TipoCambio.doubleValue());
                c12.setId_regconta_ref(reg.getId_regconta());
                detalle.add(c12);
                if (reg.getM_percepcion().compareTo(BigDecimal.ZERO) == 1) {
                    ContaDet c1 = new ContaDet();
                    c1.setIdCondicionVenta(reg.getId_condicion_venta());
                    c1.setIdTipoPago(reg.getIdTipoPago());
                    c1.setTipoCondicion(reg.getTipoCondicion());
                    c1.setFechaDoc(reg.getF_emision());
                    if (reg.getTipoCondicion().equalsIgnoreCase("CO")) {
                        c1.setId_cuenta(Id_Cuenta);
                    } else if (reg.getTipoCondicion().equalsIgnoreCase("TA")) {
                        c1.setId_cuenta(reg.getCuentaContable());
                    }
                    c1.setId_empresa(usuario.getCodempresa());
                    c1.setAnio(anio);
                    c1.setMes(mes);
                    if (reg.getId_tipo_doc().trim().equalsIgnoreCase("07")) {
                        c1.setHaber(Double.valueOf(reg.getM_percepcion().toString()) * -1);
                        c1.setId_tipo_movc(2);
                        c1.setDebe(0);
                    } else {
                        c1.setDebe(Double.valueOf(reg.getM_percepcion().toString()));
                        c1.setId_tipo_movc(1);
                        c1.setHaber(0);
                    }
                    c1.setId_tipo_doc(reg.getId_tipo_doc());
                    c1.setSerie(reg.getSerie());
                    c1.setPreimpreso(reg.getPreimpreso());
                    c1.setId_tipoanexo("2");
                    c1.setId_anexo(reg.getId_anexo());
                    if (reg.getTmp_anexo() != null) {
                        c1.setNombre(reg.getTmp_anexo());
                    } else {
                        c1.setNombre(reg.getTmp_anexo_ref());
                    }
                    c1.setFecha(getDtpFecha().getDate());
                    c1.setId_usuario(usuario.getId_usuario());
                    c1.setGlosa("Liquidacion " + getDtpFecha().getDate() + " " + usuario.getNombre());
                    c1.setId_auxiliar("00010");
                    c1.setTipo_detalle("M");
                    c1.setTipo_cambio(TipoCambio.doubleValue());
                    c1.setId_regconta_doc(reg.getId_regconta());
                    c1.setId_cuenta_ref(reg.getCuentaPercepcion());
                    c1.setId_tipo_doc_ref(reg.getId_tipo_doc());
                    c1.setSerie_ref(reg.getSerie());
                    c1.setPreimpreso_ref(reg.getPreimpreso());
                    detalle.add(c1);
                    ContaDet c13 = new ContaDet();
                    c13.setIdCondicionVenta(reg.getId_condicion_venta());
                    c13.setIdTipoPago(reg.getIdTipoPago());
                    c13.setTipoCondicion(reg.getTipoCondicion());
                    c13.setId_cuenta(reg.getCuentaPercepcion());
                    c13.setId_empresa(usuario.getCodempresa());
                    c13.setAnio(anio);
                    c13.setMes(mes);
                    c13.setDebe(0);
                    System.out.println(reg.getM_percepcion().doubleValue());
                    c13.setHaber(reg.getM_percepcion().doubleValue());
                    c13.setId_tipo_doc(reg.getId_tipo_doc());
                    c13.setSerie(reg.getSerie());
                    c13.setPreimpreso(reg.getPreimpreso());
                    c13.setId_tipoanexo("2");
                    c13.setId_anexo(reg.getId_anexo());
                    if (reg.getTmp_anexo() != null) {
                        c13.setNombre(reg.getTmp_anexo());
                    } else {
                        c13.setNombre(reg.getTmp_anexo_ref());
                    }

                    c13.setFecha(getDtpFecha().getDate());
                    c13.setId_usuario(usuario.getId_usuario());
                    c13.setGlosa("Liquidacion " + getDtpFecha().getDate() + " " + usuario.getNombre());
                    c13.setId_auxiliar("00010");
                    c13.setTipo_detalle("M");
                    c13.setFechaDoc(reg.getF_emision());
                    c13.setTipo_cambio(TipoCambio.doubleValue());
                    c13.setId_regconta_ref(reg.getId_regconta());
                    detalle.add(c13);
                }
            }
        }
        String serie = ((String) cboLiqSerie.getSelectedItem()).trim();

        insertaLiquidacion(usuario.getCodempresa(), usuario.getCodlocalidad(), id_Tipo_Anexo, itTra.getId(), usuario.getCodpuntoventa(), id_Moneda, id_Tipo_Doc, serie, getTxtLiqNumero().getText().trim(), TipoCambio, monto, getDtpFecha().getDate(), getDtpFecha().getDate(), getDtpFecha().getDate(), id_Auxiliar, anio, mes, serie, "Liquidacion " + itTra.getDescription() + " - " + getDtpFecha().getDate().toString(), id_Estado, usuario.getId_usuario(), detalle);
    }

    private void insertaLiquidacion(String xEmpresa, String xIdLocalidad, String xIdTipoAnexo, String xIdTrabajador, String xIdPuntoVenta, String xIdMoneda, String xIdTipoDoc, String xSerie, String xPreimpreso, BigDecimal xTipoCambio, BigDecimal xMonto, Date xFechaEmision, Date xFechaContable, Date xFechaCancelacion, String xIdAuxiliar, String xAnio, String xMes, String xSerieRef, String xGlosa, String xIdEstado, String xUsuario, List<ContaDet> xDetalles) {
        try {
            getBtnLiquidar().setEnabled(false);
            RnLiquidacion obj = new RnLiquidacion(path);
            boolean blnResultado;
            blnResultado = obj.InsertaLiquidacion(xEmpresa, xIdLocalidad, xIdTipoAnexo, xIdTrabajador, xIdPuntoVenta, xIdMoneda, xIdTipoDoc, xSerie, xPreimpreso, xTipoCambio, xMonto, xFechaEmision, xFechaContable, xFechaCancelacion, xIdAuxiliar, xAnio, xMes, xSerieRef, xGlosa, xIdEstado, xUsuario, xDetalles);
            if (blnResultado == true) {
                cuadro.CuadroAviso("Liquidacion Guardada", JOptionPane.PLAIN_MESSAGE);

                java.text.SimpleDateFormat sda = new java.text.SimpleDateFormat("dd/MM/yyyy");
                String fecha = sda.format(xFechaEmision);
                generaReporte(xIdTrabajador, xIdPuntoVenta, fecha);
                retornaCorrelativoxUsuario(usuario.getId_usuario(), usuario.getCodpuntoventa(), "LC");

                swAceptar = true;
                limpiaControles();
                this.setVisible(false);
            } else {
                cuadro.CuadroAviso("Error al guardar liquidación", JOptionPane.ERROR_MESSAGE);
            }
            getBtnLiquidar().setEnabled(true);
        } catch (SQLException ex) {
            cuadro.CuadroAviso("Error al guardar la liquidación", JOptionPane.ERROR_MESSAGE);
            JOptionPane.showMessageDialog(null, ex.getMessage());
            ExceptionHandler.handleException(ex, logger);
        } catch (Exception ex) {
            ExceptionHandler.handleException(ex, logger);
            JOptionPane.showMessageDialog(null, ex.getMessage());
        }
    }

    private BigDecimal retornaTipoCambio() {
        try {
            RnTipoCambio logicTc = new RnTipoCambio(path);
            Date fecha = new Date();
            BeanTipoCambio beanTc = logicTc.getBeanTipoCambio(new java.sql.Date(fecha.getTime()), "00001");

            if (beanTc != null) {
                return beanTc.getMontoventa();
            }
            bloqueaControles(false);
            return null;
        } catch (Exception ex) {
            bloqueaControles(false);
            cuadro.CuadroAviso("No se encontrÃ³ el tipo de cambio.", JOptionPane.ERROR_MESSAGE);
            ExceptionHandler.handleException(ex, logger);
            return null;
        }
    }

    public void bloqueaControles(boolean sw) {
        getTable().setEnabled(sw);
        getBtnBuscar().setEnabled(sw);
        getBtnLiquidar().setEnabled(sw);
    }

    public List<BeanCajaSerie> retornaCajaSerie(String serie, String punto_venta, String tipo_pago) {
        try {
            RnCajaSerie obj = new RnCajaSerie(path);
            return obj.RetornaCajaSerie(serie, punto_venta, tipo_pago);
        } catch (Exception ex) {
            ExceptionHandler.handleException(ex, logger);
            cuadro.CuadroAviso("Error al cargar las Cuentas", JOptionPane.ERROR_MESSAGE);
            return null;
        }
    }

    private void generaReporte(String Trabajador, String PuntoVenta, String Fecha) {
        try {
            List<BeanParametro> Listap = new ArrayList();
            BeanParametro p = new BeanParametro();
            p.setNombre("paramTrabajador");
            p.setValor(Trabajador);
            Listap.add(p);

            BeanParametro p1 = new BeanParametro();
            p1.setNombre("paramPuntoVenta");
            p1.setValor(PuntoVenta);
            Listap.add(p1);

            BeanParametro p2 = new BeanParametro();
            p2.setNombre("paramFecha");
            p2.setValor(Fecha);
            Listap.add(p2);

            String serie = ((String) cboLiqSerie.getSelectedItem()).trim();
            BeanParametro p3 = new BeanParametro();
            p3.setNombre("paramSerie");
            p3.setValor(serie);
            Listap.add(p3);

            BeanParametro p4 = new BeanParametro();
            p4.setNombre("paramEmpresa");
            p4.setValor(usuario.getDescriempresa());
            Listap.add(p4);

            new reporte_v3(path, "rpt_Liquidacion", Listap, true, false, false, false);
        } catch (Exception ex) {
            cuadro.CuadroAviso("Error al cargar reporte", JOptionPane.ERROR_MESSAGE);
            ExceptionHandler.handleException(ex, logger);
        }
    }

    private void limpiaControles() {
        inicializaTable();
        getTxtTotal().setValue(0);
        getTxtIGV().setValue(0);
        getTxtSubTotal().setValue(0);
    }

    public boolean getSwAceptar() {
        return swAceptar;
    }

    private void verificaExisteCuenta(String serie) {
        List<BeanCajaSerie> Lista = retornaCajaSerie(serie, usuario.getCodpuntoventa(), "001");
        if (Lista.isEmpty()) {
            Id_Cuenta = "";
        } else {
            Id_Cuenta = Lista.get(0).getIdCuenta();
        }
    }

    private boolean verificaCorrelativo() {
        if (!Constans.IS_CORRELATIVO_LIQ_VENTA){
            return true;
        }
        if (modelSinLiquidar.getData().size() > 0) {
            Set<String> arrayDoc = new HashSet();
            Iterator<RegContaCab> iter = modelSinLiquidar.getData().iterator();
            Map<String, List<RegContaCab>> map = new HashMap();
            while (iter.hasNext()) {
                arrayDoc.add(iter.next().getId_tipo_doc());
            }
            List<String> lstTipoDoc = new ArrayList();
            lstTipoDoc.addAll(arrayDoc);
            for (int i = 0; i < lstTipoDoc.size(); i++) {
                List<RegContaCab> lista = new ArrayList();
                for (int j = 0; j < modelSinLiquidar.getData().size(); j++) {
                    if (lstTipoDoc.get(i).equalsIgnoreCase(modelSinLiquidar.getData().get(j).getId_tipo_doc())) {
                        lista.add(modelSinLiquidar.getData().get(j));
                    }
                }
                map.put(lstTipoDoc.get(i), lista);
            }
            //System.out.println("# Documentos:" + TipoDoc.size());
            for (int i = 0; i < lstTipoDoc.size(); i++) {
                List<RegContaCab> lista = map.get(lstTipoDoc.get(i));
                for (int j = 0; j < lista.size() - 1; j++) {
                    String preimpreso = lista.get(j).getPreimpreso();
                    String preimpresoAux = lista.get(j + 1).getPreimpreso();
                    if (lista.get(j + 1).getId_tipo_doc().equals(lstTipoDoc.get(i))) {
                        if (Integer.parseInt(preimpreso) != Integer.parseInt(preimpresoAux) - 1) {
                            return false;
                        }
                    }

                }
            }
        }

        return true;
    }
}
